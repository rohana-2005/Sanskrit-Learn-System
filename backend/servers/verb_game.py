from flask import Flask, jsonify, send_from_directory
import json
import random
import argparse
from flask_cors import CORS
import sys
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load sentences data
def load_sentences():
    try:
        # Try multiple possible locations for sentences.json
        possible_paths = [
            "../dataset/sentences.json",  # From servers folder
            "dataset/sentences.json",     # From root folder
            "sentences.json"              # Current folder
        ]
        
        for path in possible_paths:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    print(f"Successfully loaded sentences from: {path}")
                    return json.load(f)
            except FileNotFoundError:
                continue
                
        print("sentences.json not found in any expected location")
        return []
    except Exception as e:
        print(f"Error loading sentences: {e}")
        return []

# Load conjugations and verbs data
def load_conjugations():
    try:
        possible_paths = [
            "../dataset/conjugations.json",
            "dataset/conjugations.json", 
            "conjugations.json"
        ]
        
        for path in possible_paths:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    print(f"Successfully loaded conjugations from: {path}")
                    return json.load(f)
            except FileNotFoundError:
                continue
        
        print("conjugations.json not found")
        return {}
    except Exception as e:
        print(f"Error loading conjugations: {e}")
        return {}

def load_verbs():
    try:
        possible_paths = [
            "../dataset/verbs.json",
            "dataset/verbs.json",
            "verbs.json"
        ]
        
        for path in possible_paths:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    raw_verbs = json.load(f)
                    verbs = []
                    for verb_class, content in raw_verbs.items():
                        for verb_entry in content["verbs"]:
                            verb_entry["verb_class"] = verb_class
                            verbs.append(verb_entry)
                    print(f"Successfully loaded {len(verbs)} verbs from: {path}")
                    return verbs
            except FileNotFoundError:
                continue
        
        print("verbs.json not found")
        return []
    except Exception as e:
        print(f"Error loading verbs: {e}")
        return []

sentences = load_sentences()
conjugations = load_conjugations()
verbs = load_verbs()

def label(person, number):
    person_label = {"1": "First person", "2": "Second person", "3": "Third person"}
    number_label = {"sg": "singular", "du": "dual", "pl": "plural"}
    return f"{person_label.get(person)} {number_label.get(number)}"

def generate_distractors(correct_form, verb_root, verb_class, verb_tense):
    all_forms = []
    
    if not conjugations:
        return []
        
    verb_data = conjugations.get(verb_tense, {}).get(verb_class, {})
    
    # 🔍 Find the exact verb entry to get stem info
    matching_verb = next(
        (v for v in verbs if v["root"] == verb_root and v["verb_class"] == verb_class),
        {"root": verb_root}
    )
    
    for key, suffix in verb_data.items():
        try:
            person, number = key.split("_")
            
            # 🧠 Choose correct stem
            if verb_tense == "future":
                stem = matching_verb.get("future_stem", verb_root)
            elif verb_tense == "past":
                stem = matching_verb.get("past_stem", verb_root)
            else:
                stem = verb_root
            
            # ✂️ Drop halant (unless present 4P)
            if not (verb_tense == "present" and verb_class == "4P"):
                if stem.endswith("्"):
                    stem = stem[:-1]
            
            form = stem + suffix.replace("A", "")
            if form != correct_form:
                all_forms.append((form, person, number))
        except Exception as e:
            print(f"Error processing conjugation {key}: {e}")
            continue
    
    return random.sample(all_forms, min(3, len(all_forms)))

def replace_verb_with_blank(sentence_dict):
    sentence_text = sentence_dict["sentence"]
    verb_form = sentence_dict["verb"]["form"]
    parts = sentence_text.split()
    
    if verb_form in parts:
        parts[parts.index(verb_form)] = "_____"
    else:
        parts[-1] = "_____"
    
    return " ".join(parts)

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "server": "verb_game"})

@app.route('/')
def home():
    return send_from_directory('../games', 'verb.html')

@app.route('/api/get-game')
def get_verb_game():
    if not sentences:
        return jsonify({"error": "No sentences available"}), 404
    
    try:
        sentence = random.choice(sentences)
        subject = sentence["subject"]
        subject_form = subject["form"]
        subj_person = subject["person"]
        subj_number = subject["number"]
        
        verb = sentence["verb"]
        verb_root = verb["root"]
        verb_class = verb["class"]
        verb_meaning = verb.get("meaning", "N/A")
        correct_form = verb["form"]
        verb_tense = sentence["tense"]  # ✅ Use sentence tense
        
        base_sentence = replace_verb_with_blank(sentence)
        
        # ✅ Generate distractors using same tense
        options = [correct_form]
        
        if conjugations and verbs:
            try:
                distractors = generate_distractors(correct_form, verb_root, verb_class, verb_tense)
                distractor_forms = [opt for opt, _, _ in distractors]
                options.extend(distractor_forms)
            except Exception as e:
                print(f"Error generating distractors: {e}")
                # Fallback to random selection
                wrong_options = []
                for other_sentence in random.sample(sentences, min(10, len(sentences))):
                    if other_sentence["verb"]["form"] != correct_form:
                        wrong_options.append(other_sentence["verb"]["form"])
                options.extend(random.sample(wrong_options, min(3, len(wrong_options))))
        else:
            # Fallback to random selection
            wrong_options = []
            for other_sentence in random.sample(sentences, min(10, len(sentences))):
                if other_sentence["verb"]["form"] != correct_form:
                    wrong_options.append(other_sentence["verb"]["form"])
            options.extend(random.sample(wrong_options, min(3, len(wrong_options))))
        
        random.shuffle(options)
        
        explanation = (
            f"The subject '{subject_form}' is in {label(subj_person, subj_number).lower()} form. "
            f"The verb root is '{verb_root}', which belongs to class {verb_class} and means '{verb_meaning}'. "
            + ("This verb requires an object. " if sentence["object"] else "This verb does not require an object. ")
            + f"The correct verb form is '{correct_form}' to match the subject. "
            f"The full sentence is: {sentence['sentence']}"
        )
        
        hint = f"Hint: Subject '{subject_form}' is {label(subj_person, subj_number)}."
        
        return jsonify({
            "sentence": base_sentence,
            "options": options,
            "correct": correct_form,
            "explanation": explanation,
            "hint": hint
        })
        
    except Exception as e:
        print(f"Error in get_verb_game: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=5002)
    args = parser.parse_args()
    
    print(f"Loaded {len(sentences)} sentences")
    print(f"Conjugations available: {list(conjugations.keys()) if conjugations else 'None'}")
    print(f"Verbs loaded: {len(verbs)}")
    
    app.run(debug=True, host='0.0.0.0', port=args.port)
