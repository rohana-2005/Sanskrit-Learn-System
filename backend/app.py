from flask import Flask, jsonify, send_from_directory, redirect, url_for
from flask_cors import CORS
import subprocess
import threading
import time
import requests
import os
import sys
from pathlib import Path

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
SANS_SENT_PORT = 5001
VERB_GAME_PORT = 5002
MAIN_PORT = 5000

# Server process holders
sans_sent_process = None
verb_game_process = None

def start_server(script_path, port, server_name):
    """Start a server script as a subprocess"""
    try:
        print(f"Starting {server_name} on port {port}...")
        
        # Get the full path to the script
        script_full_path = Path("servers") / script_path
        
        if not script_full_path.exists():
            print(f"Error: {script_full_path} not found")
            return None
        
        # Start the server process with environment variables
        env = os.environ.copy()
        env['PYTHONPATH'] = str(Path.cwd())
        
        process = subprocess.Popen([
            sys.executable, str(script_full_path), "--port", str(port)
        ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, 
           universal_newlines=True, env=env)
        
        print(f"{server_name} started with PID: {process.pid}")
        
        # Start a thread to read and print the output
        def print_output():
            for line in process.stdout:
                print(f"[{server_name}] {line.strip()}")
        
        threading.Thread(target=print_output, daemon=True).start()
        
        return process
    except Exception as e:
        print(f"Error starting {server_name}: {e}")
        return None

def check_server_health(port, server_name):
    """Check if a server is running and healthy"""
    try:
        response = requests.get(f"http://localhost:{port}/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def start_background_servers():
    """Start both background servers"""
    global sans_sent_process, verb_game_process
    
    # Start sentence game server
    sans_sent_process = start_server("sans_sent_game.py", SANS_SENT_PORT, "Sentence Game Server")
    
    # Start verb game server  
    verb_game_process = start_server("verb_game.py", VERB_GAME_PORT, "Verb Game Server")
    
    # Wait a moment for servers to start
    time.sleep(8)
    
    # Check if servers are running
    if check_server_health(SANS_SENT_PORT, "Sentence Game"):
        print("✓ Sentence Game Server is running")
    else:
        print("✗ Sentence Game Server failed to start")
        
    if check_server_health(VERB_GAME_PORT, "Verb Game"):
        print("✓ Verb Game Server is running")
    else:
        print("✗ Verb Game Server failed to start")

# Routes
@app.route('/')
def home():
    """Main dashboard"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sanskrit Learning System</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .game-card { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .game-card h3 { color: #333; }
            .btn { background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 5px; }
            .btn:hover { background: #45a049; }
            .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
            .status.online { background: #d4edda; color: #155724; }
            .status.offline { background: #f8d7da; color: #721c24; }
        </style>
    </head>
    <body>
        <h1>🕉️ Sanskrit Learning System</h1>
        <p>Welcome to the unified Sanskrit learning platform!</p>
        
        <div class="game-card">
            <h3>📝 Sentence Analysis Game</h3>
            <p>Learn Sanskrit sentence structure by analyzing subjects, objects, and verbs.</p>
            <a href="/sentence-game" class="btn">Play Sentence Game</a>
            <a href="/api/sentence-status" class="btn">Check Status</a>
        </div>
        
        <div class="game-card">
            <h3>🔤 Verb Conjugation Game</h3>
            <p>Practice Sanskrit verb forms and conjugations.</p>
            <a href="/verb-game" class="btn">Play Verb Game</a>
            <a href="/api/verb-status" class="btn">Check Status</a>
        </div>
        
        <div class="game-card">
            <h3>⚙️ System Controls</h3>
            <a href="/api/restart-servers" class="btn">Restart Servers</a>
            <a href="/api/status" class="btn">System Status</a>
            <a href="/api/generate-sentences" class="btn">Generate New Sentences</a>
        </div>
    </body>
    </html>
    '''

@app.route('/sentence-game')
def sentence_game():
    """Serve sentence game HTML"""
    try:
        return send_from_directory('games', 'sent_game.html')
    except Exception as e:
        return f"Error loading sentence game: {e}", 404

@app.route('/verb-game')
def verb_game():
    """Serve verb game HTML"""
    try:
        return send_from_directory('games', 'verb.html')
    except Exception as e:
        return f"Error loading verb game: {e}", 404

# Direct API endpoints that games expect
@app.route('/get_random_sentence')
def get_random_sentence():
    """Proxy to sentence game server"""
    try:
        response = requests.get(f"http://localhost:{SANS_SENT_PORT}/get_random_sentence", timeout=10)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "Failed to get sentence from server"}), response.status_code
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Sentence server is not running. Please check server status."}), 503
    except Exception as e:
        return jsonify({"error": f"Sentence server error: {str(e)}"}), 503

@app.route('/api/get-game')
def get_verb_game():
    """Proxy to verb game server"""
    try:
        response = requests.get(f"http://localhost:{VERB_GAME_PORT}/api/get-game", timeout=10)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"error": "Failed to get game data from server"}), response.status_code
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Verb server is not running. Please check server status."}), 503
    except Exception as e:
        return jsonify({"error": f"Verb server error: {str(e)}"}), 503

# System Management Routes
@app.route('/api/status')
def system_status():
    """Check status of all servers"""
    sentence_status = check_server_health(SANS_SENT_PORT, "Sentence Game")
    verb_status = check_server_health(VERB_GAME_PORT, "Verb Game")
    
    return jsonify({
        "main_server": "online",
        "sentence_game_server": "online" if sentence_status else "offline",
        "verb_game_server": "online" if verb_status else "offline",
        "ports": {
            "main": MAIN_PORT,
            "sentence_game": SANS_SENT_PORT,
            "verb_game": VERB_GAME_PORT
        }
    })

@app.route('/api/sentence-status')
def sentence_status():
    """Check sentence server status"""
    status = check_server_health(SANS_SENT_PORT, "Sentence Game")
    return jsonify({
        "status": "online" if status else "offline",
        "port": SANS_SENT_PORT,
        "url": f"http://localhost:{SANS_SENT_PORT}"
    })

@app.route('/api/verb-status')
def verb_status():
    """Check verb server status"""
    status = check_server_health(VERB_GAME_PORT, "Verb Game")
    return jsonify({
        "status": "online" if status else "offline", 
        "port": VERB_GAME_PORT,
        "url": f"http://localhost:{VERB_GAME_PORT}"
    })

@app.route('/api/restart-servers')
def restart_servers():
    """Restart both game servers"""
    global sans_sent_process, verb_game_process
    
    # Stop existing processes
    if sans_sent_process:
        sans_sent_process.terminate()
    if verb_game_process:
        verb_game_process.terminate()
    
    # Start servers in background thread
    threading.Thread(target=start_background_servers, daemon=True).start()
    
    return jsonify({"message": "Servers are restarting..."})

@app.route('/api/generate-sentences')
def generate_sentences():
    """Run the sentence generation script"""
    try:
        # Change to dataset directory
        original_dir = os.getcwd()
        dataset_path = Path("dataset")
        
        if not dataset_path.exists():
            return jsonify({
                "status": "error",
                "message": "Dataset directory not found"
            }), 404
            
        os.chdir(dataset_path)
        
        # Run gen.py
        result = subprocess.run([sys.executable, "gen.py"], 
                              capture_output=True, text=True)
        
        # Change back
        os.chdir(original_dir)
        
        if result.returncode == 0:
            return jsonify({
                "status": "success",
                "message": "Sentences generated successfully",
                "output": result.stdout
            })
        else:
            return jsonify({
                "status": "error", 
                "message": "Failed to generate sentences",
                "error": result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error running sentence generation: {str(e)}"
        }), 500

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "server": "main"})

def cleanup_processes():
    """Clean up background processes on exit"""
    global sans_sent_process, verb_game_process
    
    if sans_sent_process:
        sans_sent_process.terminate()
        print("Stopped Sentence Game Server")
        
    if verb_game_process:
        verb_game_process.terminate()
        print("Stopped Verb Game Server")

if __name__ == '__main__':
    import atexit
    
    print("🕉️ Starting Sanskrit Learning System...")
    print(f"Main server will run on: http://localhost:{MAIN_PORT}")
    print(f"Sentence game server: http://localhost:{SANS_SENT_PORT}")
    print(f"Verb game server: http://localhost:{VERB_GAME_PORT}")
    
    # Register cleanup function
    atexit.register(cleanup_processes)
    
    # Start background servers
    threading.Thread(target=start_background_servers, daemon=True).start()
    
    # Start main server
    try:
        app.run(debug=True, host='0.0.0.0', port=MAIN_PORT, use_reloader=False)
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        cleanup_processes()
