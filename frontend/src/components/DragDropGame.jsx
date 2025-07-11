import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DragDropGame = ({ onLogout }) => {
  const navigate = useNavigate();
  const [currentSentence, setCurrentSentence] = useState({});
  const [words, setWords] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [hintsShown, setHintsShown] = useState(false);
  const [currentWordAnalysis, setCurrentWordAnalysis] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');
  const [hints, setHints] = useState({
    subject: '',
    object: '',
    verb: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [wordAnalysisTitle, setWordAnalysisTitle] = useState('Word Analysis');
  const [wordToAnalyze, setWordToAnalyze] = useState('');
  const [wordAnalysisFeedback, setWordAnalysisFeedback] = useState('');
  const [showAnswers, setShowAnswers] = useState({});
  const [droppedWords, setDroppedWords] = useState({
    subject: '',
    object: '',
    verb: ''
  });
  const [wordAnalysisOptions, setWordAnalysisOptions] = useState([]);
  const [wordAnalysisDropped, setWordAnalysisDropped] = useState({});

  // Refs
  const draggedElement = useRef(null);

  // CSS Styles matching the HTML file
  const styles = {
    body: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      textAlign: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #d2691e 0%, #cd853f 25%, #daa520 50%, #b8860b 75%, #a0522d 100%)',
      color: 'white',
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    sentenceDisplay: {
      fontSize: '24px',
      margin: '20px 0',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '5px',
      color: '#333'
    },
    dropArea: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: '20px 0',
      flexWrap: 'wrap'
    },
    dropZone: {
      width: '30%',
      minHeight: '100px',
      border: '2px dashed #ccc',
      borderRadius: '5px',
      padding: '10px',
      margin: '0 5px',
      position: 'relative',
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    dropZoneHighlight: {
      borderColor: '#4CAF50',
      backgroundColor: '#e8f5e9'
    },
    wordOption: {
      display: 'inline-block',
      padding: '8px 12px',
      margin: '5px',
      backgroundColor: '#2196F3',
      color: 'white',
      borderRadius: '4px',
      cursor: 'grab',
      userSelect: 'none'
    },
    wordOptionDragging: {
      opacity: 0.5
    },
    optionsContainer: {
      margin: '20px 0',
      minHeight: '60px',
      maxHeight: '200px',
      overflowY: 'auto',
      padding: '10px',
      border: '1px solid #eee',
      borderRadius: '5px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    feedback: {
      margin: '20px 0',
      fontSize: '18px',
      minHeight: '24px',
      color: feedbackColor || 'white'
    },
    button: {
      padding: '10px 20px',
      margin: '10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    buttonHover: {
      backgroundColor: '#45a049'
    },
    logoutButton: {
      padding: '10px 20px',
      margin: '10px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    hint: {
      fontSize: '14px',
      color: '#666',
      marginTop: '5px'
    },
    learnMoreBtn: {
      marginTop: '10px',
      display: 'block',
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    modal: {
      display: 'block',
      position: 'fixed',
      zIndex: 1,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)'
    },
    modalContent: {
      backgroundColor: '#fefefe',
      margin: '5% auto',
      padding: '20px',
      border: '1px solid #888',
      width: '80%',
      maxWidth: '600px',
      borderRadius: '5px',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
      color: '#333'
    },
    close: {
      color: '#aaa',
      float: 'right',
      fontSize: '28px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    wordAnalysisOptions: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      margin: '20px 0'
    },
    analysisDropzoneContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '10px',
      margin: '20px 0',
      maxHeight: '60vh',
      overflowY: 'auto'
    },
    wordAnalysisDropzone: {
      minHeight: '60px',
      border: '2px dashed #ccc',
      borderRadius: '5px',
      padding: '10px',
      margin: '10px'
    },
    wordAnalysisDropzoneHighlight: {
      borderColor: '#4CAF50',
      backgroundColor: '#e8f5e9'
    },
    showAnswer: {
      fontSize: '12px',
      color: '#666',
      cursor: 'pointer',
      marginLeft: '5px'
    },
    answer: {
      color: '#4CAF50',
      fontWeight: 'bold',
      marginTop: '5px'
    },
    wordAnalysisFeedback: {
      margin: '20px 0',
      fontSize: '18px',
      minHeight: '24px'
    }
  };

  // Initialize game on component mount
  useEffect(() => {
    initGame();
  }, []);

  // Utility function to shuffle array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize the game
  const initGame = async () => {
    clearDropZones();
    
    try {
      // Try connecting to the Python server first (port 5001)
      let response;
      try {
        response = await fetch('http://127.0.0.1:5001/get_random_sentence');
        if (!response.ok) {
          throw new Error('Python server not responding');
        }
      } catch (error) {
        // Fallback to mock data if Python server is not running
        console.log('Python server not available, using mock data');
        const mockData = {
          sentence: "रामः गच्छति",
          subject: { form: "रामः", root: "राम", gender: "masculine", number: "singular", person: "third" },
          object: null,
          verb: { form: "गच्छति", root: "गम्", class: "1", meaning: "goes", person: "third", number: "singular" },
          hint: {
            subject: { gender: "masculine", number: "singular" },
            verb: { class: "1", meaning: "goes", person: "third", number: "singular" }
          }
        };
        
        setCurrentSentence(mockData);
        setWords(shuffleArray(mockData.sentence.split(' ')));
        setCorrectAnswers({
          subject: mockData.subject,
          object: mockData.object,
          verb: mockData.verb
        });
        setHintsShown(false);
        clearHints();
        setFeedback('');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setCurrentSentence(data);
      setWords(shuffleArray(data.sentence.split(' ')));
      setCorrectAnswers({
        subject: data.subject,
        object: data.object,
        verb: data.verb
      });
      setHintsShown(false);
      clearHints();
      setFeedback('');
    } catch (error) {
      console.error('Error fetching sentence:', error);
      setFeedback('Error loading sentence. Make sure the server is running.');
      setFeedbackColor('red');
    }
  };

  // Clear words from drop zones
  const clearDropZones = () => {
    setDroppedWords({
      subject: '',
      object: '',
      verb: ''
    });
  };

  // Clear hints
  const clearHints = () => {
    setHints({
      subject: '',
      object: '',
      verb: ''
    });
  };

  // Drag start handler
  const handleDragStart = (e, word) => {
    e.dataTransfer.setData('text/plain', word);
    draggedElement.current = word;
    e.target.style.opacity = '0.5';
  };

  // Drag end handler
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  // Drop handler
  const handleDrop = (e, dropZone) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    
    // Remove word from any existing drop zone
    const newDroppedWords = { ...droppedWords };
    Object.keys(newDroppedWords).forEach(key => {
      if (newDroppedWords[key] === word) {
        newDroppedWords[key] = '';
      }
    });
    
    // Add word to new drop zone
    newDroppedWords[dropZone] = word;
    setDroppedWords(newDroppedWords);
    
    // Remove word from available words
    setWords(prev => prev.filter(w => w !== word));
    
    // Check completion after state update
    setTimeout(() => checkCompletion(newDroppedWords), 0);
  };

  // Drag over handler
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Check completion
  const checkCompletion = (droppedWordsState) => {
    if (droppedWordsState.subject && droppedWordsState.verb) {
      const isSubjectCorrect = droppedWordsState.subject === (correctAnswers.subject ? correctAnswers.subject.form : null);
      const isObjectCorrect = droppedWordsState.object ? 
        droppedWordsState.object === (correctAnswers.object ? correctAnswers.object.form : null) : 
        correctAnswers.object === null;
      const isVerbCorrect = droppedWordsState.verb === (correctAnswers.verb ? correctAnswers.verb.form : null);
      
      if (isSubjectCorrect && isObjectCorrect && isVerbCorrect) {
        showFeedback('Correct! Well done!', 'green');
      } else {
        showFeedback('Not quite right. Try again or check hints.', 'red');
      }
    }
  };

  // Show feedback
  const showFeedback = (message, color) => {
    setFeedback(message);
    setFeedbackColor(color);
  };

  // Show hints
  const handleShowHints = () => {
    if (!hintsShown) {
      setHintsShown(true);
      
      const newHints = { ...hints };
      
      if (currentSentence.hint?.subject) {
        newHints.subject = `Gender: ${currentSentence.hint.subject.gender}, Number: ${currentSentence.hint.subject.number}`;
      } else {
        newHints.subject = 'No subject in this sentence';
      }
      
      if (currentSentence.hint?.object) {
        newHints.object = `Gender: ${currentSentence.hint.object.gender}, Number: ${currentSentence.hint.object.number}`;
      } else {
        newHints.object = 'No object in this sentence';
      }
      
      newHints.verb = `Class: ${currentSentence.hint?.verb?.class}, Meaning: "${currentSentence.hint?.verb?.meaning}", Person: ${currentSentence.hint?.verb?.person}, Number: ${currentSentence.hint?.verb?.number}`;
      
      setHints(newHints);
    }
  };

  // Initialize word analysis
  const initWordAnalysis = (wordData, type) => {
    setCurrentWordAnalysis(wordData);
    setWordAnalysisTitle(`${type} Analysis`);
    setWordToAnalyze(wordData.form || wordData);
    setWordAnalysisFeedback('');
    setShowAnswers({});
    setWordAnalysisDropped({});
    
    // Create properties array
    const properties = [];
    if (wordData.root) properties.push({type: 'root', text: String(wordData.root)});
    if (wordData.form) properties.push({type: 'form', text: String(wordData.form)});
    if (wordData.number) properties.push({type: 'number', text: String(wordData.number)});
    if (wordData.gender) properties.push({type: 'gender', text: String(wordData.gender)});
    if (wordData.person) properties.push({type: 'person', text: String(wordData.person)});
    if (wordData.stem) properties.push({type: 'stem', text: String(wordData.stem)});
    if (wordData.class && type === 'Verb') properties.push({type: 'class', text: String(wordData.class)});
    if (wordData.meaning && type === 'Verb') properties.push({type: 'meaning', text: String(wordData.meaning)});
    
    setWordAnalysisOptions(shuffleArray(properties));
    setModalOpen(true);
  };

  // Word analysis drag handlers
  const handleWordAnalysisDragStart = (e, option) => {
    e.dataTransfer.setData('application/json', JSON.stringify(option));
    e.target.style.opacity = '0.5';
  };

  const handleWordAnalysisDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleWordAnalysisDrop = (e, property) => {
    e.preventDefault();
    const option = JSON.parse(e.dataTransfer.getData('application/json'));
    
    if (option.type === property) {
      setWordAnalysisDropped(prev => ({
        ...prev,
        [property]: option
      }));
      
      setWordAnalysisOptions(prev => prev.filter(opt => 
        !(opt.type === option.type && opt.text === option.text)
      ));
    }
  };

  // Check word analysis answers
  const checkWordAnalysisAnswers = () => {
    let allCorrect = true;
    let feedback = [];
    
    const properties = ['root', 'form', 'number', 'gender', 'person', 'stem'];
    if (wordAnalysisTitle.includes('Verb')) {
      properties.push('class', 'meaning');
    }
    
    properties.forEach(property => {
      const dropped = wordAnalysisDropped[property];
      const correct = currentWordAnalysis[property];
      
      if (correct && dropped && String(dropped.text) !== String(correct)) {
        allCorrect = false;
        feedback.push(`${property} is incorrect`);
      }
    });
    
    if (allCorrect) {
      setWordAnalysisFeedback('Correct! Well done!');
    } else {
      setWordAnalysisFeedback(feedback.join(', ') || 'Some answers are incorrect');
    }
  };

  // Toggle answer visibility
  const toggleAnswer = (property) => {
    setShowAnswers(prev => ({
      ...prev,
      [property]: !prev[property]
    }));
  };

  // Get answer value
  const getAnswerValue = (property) => {
    if (!currentWordAnalysis) return 'N/A';
    
    let value = currentWordAnalysis[property];
    if (value === null) return 'Not applicable';
    if (value === '' || value === undefined) return 'N/A';
    return String(value);
  };

  return (
    <div style={styles.body}>
      {/* Header with navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          style={{
            padding: '10px 20px',
            margin: '10px',
            backgroundColor: '#607D8B',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }} 
          onClick={() => navigate('/hero')}
        >
          ← Back to Hero
        </button>
        <h1 style={{ margin: 0 }}>Sanskrit Sentence Analyzer</h1>
        <button 
          style={{
            padding: '10px 20px',
            margin: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }} 
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
      
      <p>Drag and drop the words into the correct categories:</p>
      
      <div style={styles.sentenceDisplay}>
        {currentSentence.sentence || 'Loading sentence...'}
      </div>
      
      <div style={styles.optionsContainer}>
        {words.map((word, index) => (
          <div
            key={`${word}-${index}`}
            style={styles.wordOption}
            draggable
            onDragStart={(e) => handleDragStart(e, word)}
            onDragEnd={handleDragEnd}
          >
            {word}
          </div>
        ))}
      </div>
      
      <div style={styles.dropArea}>
        <div 
          style={styles.dropZone}
          onDrop={(e) => handleDrop(e, 'subject')}
          onDragOver={handleDragOver}
        >
          <h3>Subject</h3>
          {droppedWords.subject && (
            <div style={styles.wordOption}>{droppedWords.subject}</div>
          )}
          <div style={styles.hint}>{hints.subject}</div>
          <button 
            style={styles.learnMoreBtn}
            onClick={() => currentSentence.subject && initWordAnalysis(currentSentence.subject, 'Subject')}
            disabled={!currentSentence.subject}
          >
            Learn More
          </button>
        </div>
        
        <div 
          style={styles.dropZone}
          onDrop={(e) => handleDrop(e, 'object')}
          onDragOver={handleDragOver}
        >
          <h3>Object</h3>
          {droppedWords.object && (
            <div style={styles.wordOption}>{droppedWords.object}</div>
          )}
          <div style={styles.hint}>{hints.object}</div>
          <button 
            style={styles.learnMoreBtn}
            onClick={() => currentSentence.object && initWordAnalysis(currentSentence.object, 'Object')}
            disabled={!currentSentence.object}
          >
            Learn More
          </button>
        </div>
        
        <div 
          style={styles.dropZone}
          onDrop={(e) => handleDrop(e, 'verb')}
          onDragOver={handleDragOver}
        >
          <h3>Verb</h3>
          {droppedWords.verb && (
            <div style={styles.wordOption}>{droppedWords.verb}</div>
          )}
          <div style={styles.hint}>{hints.verb}</div>
          <button 
            style={styles.learnMoreBtn}
            onClick={() => currentSentence.verb && initWordAnalysis(currentSentence.verb, 'Verb')}
            disabled={!currentSentence.verb}
          >
            Learn More
          </button>
        </div>
      </div>
      
      <div style={styles.feedback}>
        {feedback}
      </div>
      
      <button style={styles.button} onClick={handleShowHints}>Show Hint</button>
      <button style={styles.button} onClick={initGame}>Next Sentence</button>
      <button style={styles.logoutButton} onClick={onLogout}>Logout</button>
      
      {/* Modal for word analysis */}
      {modalOpen && (
        <div style={styles.modal} onClick={() => setModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span style={styles.close} onClick={() => setModalOpen(false)}>&times;</span>
            <h2>{wordAnalysisTitle}</h2>
            <div>
              <div>Analyzing: <span>{wordToAnalyze}</span></div>
              
              <div style={styles.wordAnalysisOptions}>
                {wordAnalysisOptions.map((option, index) => (
                  <div
                    key={`${option.type}-${index}`}
                    style={styles.wordOption}
                    draggable
                    onDragStart={(e) => handleWordAnalysisDragStart(e, option)}
                    onDragEnd={handleWordAnalysisDragEnd}
                  >
                    {option.text}
                  </div>
                ))}
              </div>
              
              <div style={styles.analysisDropzoneContainer}>
                {['root', 'form', 'gender', 'number', 'person', 'stem'].map(property => (
                  <div 
                    key={property} 
                    style={styles.wordAnalysisDropzone}
                    onDrop={(e) => handleWordAnalysisDrop(e, property)}
                    onDragOver={handleDragOver}
                  >
                    <h3>
                      {property.charAt(0).toUpperCase() + property.slice(1)}
                      <span 
                        style={styles.showAnswer}
                        onClick={() => toggleAnswer(property)}
                      >
                        ({showAnswers[property] ? 'Hide Answer' : 'Show Answer'})
                      </span>
                    </h3>
                    {wordAnalysisDropped[property] && (
                      <div style={styles.wordOption}>{wordAnalysisDropped[property].text}</div>
                    )}
                    {showAnswers[property] && (
                      <div style={styles.answer}>{getAnswerValue(property)}</div>
                    )}
                  </div>
                ))}
                
                {wordAnalysisTitle.includes('Verb') && (
                  <>
                    <div 
                      style={styles.wordAnalysisDropzone}
                      onDrop={(e) => handleWordAnalysisDrop(e, 'class')}
                      onDragOver={handleDragOver}
                    >
                      <h3>
                        Class
                        <span 
                          style={styles.showAnswer}
                          onClick={() => toggleAnswer('class')}
                        >
                          ({showAnswers['class'] ? 'Hide Answer' : 'Show Answer'})
                        </span>
                      </h3>
                      {wordAnalysisDropped['class'] && (
                        <div style={styles.wordOption}>{wordAnalysisDropped['class'].text}</div>
                      )}
                      {showAnswers['class'] && (
                        <div style={styles.answer}>{getAnswerValue('class')}</div>
                      )}
                    </div>
                    
                    <div 
                      style={styles.wordAnalysisDropzone}
                      onDrop={(e) => handleWordAnalysisDrop(e, 'meaning')}
                      onDragOver={handleDragOver}
                    >
                      <h3>
                        Meaning
                        <span 
                          style={styles.showAnswer}
                          onClick={() => toggleAnswer('meaning')}
                        >
                          ({showAnswers['meaning'] ? 'Hide Answer' : 'Show Answer'})
                        </span>
                      </h3>
                      {wordAnalysisDropped['meaning'] && (
                        <div style={styles.wordOption}>{wordAnalysisDropped['meaning'].text}</div>
                      )}
                      {showAnswers['meaning'] && (
                        <div style={styles.answer}>{getAnswerValue('meaning')}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div style={styles.wordAnalysisFeedback}>
                {wordAnalysisFeedback}
              </div>
              
              <button style={styles.button} onClick={checkWordAnalysisAnswers}>
                Check Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropGame;