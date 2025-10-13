/// <reference types="chrome"/>
import { useEffect, useState } from 'react'

interface SuccessResponse {
  success: boolean;
}

function App() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ratingOption, setRatingOption] = useState('first')
  const [commentText, setCommentText] = useState('Good')
  const [randomizeRating, setRandomizeRating] = useState(false)
  const [ratingMin, setRatingMin] = useState(1)
  const [ratingMax, setRatingMax] = useState(5)
  const [randomizeComment, setRandomizeComment] = useState(false)

  useEffect(() => {
    // Get initial status and settings
    chrome.storage.local.get([
      'autoFillEnabled', 
      'ratingOption', 
      'commentText', 
      'randomizeRating',
      'ratingMin',
      'ratingMax',
      'randomizeComment'
    ], (result) => {
      setIsEnabled(result.autoFillEnabled || false)
      setRatingOption(result.ratingOption || 'first')
      setCommentText(result.commentText || 'Good')
      setRandomizeRating(result.randomizeRating || false)
      setRatingMin(result.ratingMin || 1)
      setRatingMax(result.ratingMax || 5)
      setRandomizeComment(result.randomizeComment || false)
      setLoading(false)
    })

    // Listen for storage changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.autoFillEnabled) {
        setIsEnabled(changes.autoFillEnabled.newValue)
      }
      if (changes.ratingOption) {
        setRatingOption(changes.ratingOption.newValue)
      }
      if (changes.commentText) {
        setCommentText(changes.commentText.newValue)
      }
      if (changes.randomizeRating) {
        setRandomizeRating(changes.randomizeRating.newValue)
      }
      if (changes.ratingMin) {
        setRatingMin(changes.ratingMin.newValue)
      }
      if (changes.ratingMax) {
        setRatingMax(changes.ratingMax.newValue)
      }
      if (changes.randomizeComment) {
        setRandomizeComment(changes.randomizeComment.newValue)
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    chrome.runtime.sendMessage({ 
      type: 'TOGGLE_AUTOFILL', 
      enabled: newState 
    }, (response: SuccessResponse) => {
      if (response && response.success) {
        console.log('Toggle successful')
      }
    })
  }

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRating = e.target.value
    const isRandomize = newRating === 'randomize'
    setRatingOption(newRating)
    setRandomizeRating(isRandomize)
    chrome.storage.local.set({ 
      ratingOption: newRating,
      randomizeRating: isRandomize 
    })
  }

  const handleRatingMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1
    setRatingMin(value)
    chrome.storage.local.set({ ratingMin: value })
  }

  const handleRatingMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 5
    setRatingMax(value)
    chrome.storage.local.set({ ratingMax: value })
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value
    setCommentText(newComment)
    chrome.storage.local.set({ commentText: newComment })
  }

  const handleRandomizeCommentToggle = () => {
    const newState = !randomizeComment
    setRandomizeComment(newState)
    chrome.storage.local.set({ randomizeComment: newState })
  }

  return (
    <div style={{
      backgroundColor: '#000',
      width: '100%',
      maxHeight: '600px',
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      boxSizing: 'border-box'
    } as React.CSSProperties}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '24px'
        }}>
          <img 
            src="/images/logo-with-text.png" 
            alt="Qalam Surveys Logo" 
            style={{
              height: '128px',
              width: 'auto'
            }}
          />
        </div>

        {/* Main content area */}
        <div style={{
          color: 'white',
          width: '100%'
        }}>
          {/* Auto-fill Toggle */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #333',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>Auto-Fill Surveys</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#999'
                }}>
                  Automatically fill and submit Qalam surveys
                </p>
              </div>
              <button
                onClick={handleToggle}
                disabled={loading}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  height: '32px',
                  width: '56px',
                  alignItems: 'center',
                  borderRadius: '9999px',
                  backgroundColor: isEnabled ? '#16a34a' : '#666',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'background-color 0.3s'
                }}
              >
                <span style={{
                  display: 'inline-block',
                  height: '24px',
                  width: '24px',
                  borderRadius: '9999px',
                  backgroundColor: 'white',
                  transform: isEnabled ? 'translateX(28px)' : 'translateX(4px)',
                  transition: 'transform 0.3s'
                }} />
              </button>
            </div>
            <div style={{
              fontSize: '14px',
              marginTop: '12px'
            }}>
              <span style={{
                fontWeight: '600',
                color: isEnabled ? '#4ade80' : '#f87171'
              }}>
                Status: {isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Configuration */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #333',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>Configuration</h3>
            
            {/* Rating Option */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#ccc'
              }}>
                Rating Selection
              </label>
              <select
                value={ratingOption}
                onChange={handleRatingChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'Raleway, sans-serif'
                }}
              >
                <option value="first">First Option (Highest Rating)</option>
                <option value="last">Last Option (Lowest Rating)</option>
                <option value="middle">Middle Option</option>
                <option value="second">Second Option</option>
                <option value="second-last">Second to Last Option</option>
                <option value="randomize">🎲 Randomize (Select Range)</option>
              </select>
              <p style={{
                fontSize: '12px',
                color: '#888',
                marginTop: '4px',
                marginBottom: 0
              }}>
                Choose which radio button to select for each question
              </p>

              {/* Random Range Inputs */}
              {randomizeRating && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#222',
                  borderRadius: '6px',
                  border: '1px solid #444'
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#aaa',
                    marginBottom: '8px',
                    marginTop: 0
                  }}>
                    🎲 Randomize Range (option numbers)
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        color: '#999',
                        marginBottom: '4px'
                      }}>
                        From
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={ratingMin}
                        onChange={handleRatingMinChange}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          backgroundColor: '#2a2a2a',
                          color: 'white',
                          border: '1px solid #444',
                          borderRadius: '4px',
                          fontSize: '14px',
                          outline: 'none',
                          fontFamily: 'Raleway, sans-serif',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ paddingTop: '20px', color: '#666' }}>→</div>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        color: '#999',
                        marginBottom: '4px'
                      }}>
                        To
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={ratingMax}
                        onChange={handleRatingMaxChange}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          backgroundColor: '#2a2a2a',
                          color: 'white',
                          border: '1px solid #444',
                          borderRadius: '4px',
                          fontSize: '14px',
                          outline: 'none',
                          fontFamily: 'Raleway, sans-serif',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                  <p style={{
                    fontSize: '11px',
                    color: '#666',
                    marginTop: '6px',
                    marginBottom: 0
                  }}>
                    Example: Options 3-5 means randomly pick option 3, 4, or 5
                  </p>
                </div>
              )}
            </div>

            {/* Comment Text */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ccc'
                }}>
                  Comment Text
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: randomizeComment ? '#4ade80' : '#666'
                  }}>
                    🎲 Randomize
                  </span>
                  <button
                    onClick={handleRandomizeCommentToggle}
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      height: '20px',
                      width: '36px',
                      alignItems: 'center',
                      borderRadius: '9999px',
                      backgroundColor: randomizeComment ? '#16a34a' : '#444',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <span style={{
                      display: 'inline-block',
                      height: '14px',
                      width: '14px',
                      borderRadius: '9999px',
                      backgroundColor: 'white',
                      transform: randomizeComment ? 'translateX(19px)' : 'translateX(3px)',
                      transition: 'transform 0.3s'
                    }} />
                  </button>
                </div>
              </div>
              <textarea
                value={commentText}
                onChange={handleCommentChange}
                placeholder={randomizeComment ? "Good, Excellent, Great, Nice" : "Enter your comment..."}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '60px',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'Raleway, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{
                fontSize: '12px',
                color: '#888',
                marginTop: '4px',
                marginBottom: 0
              }}>
                {randomizeComment 
                  ? '🎲 Enter comma-separated comments. One will be randomly selected for each survey.'
                  : 'This text will be added to comment fields in surveys'
                }
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #333',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>How to Use</h3>
            <ol style={{
              fontSize: '14px',
              color: '#ccc',
              paddingLeft: '20px',
              margin: 0
            }}>
              <li style={{ marginBottom: '8px' }}>Configure your rating and comment preferences above</li>
              <li style={{ marginBottom: '8px' }}>Enable the auto-fill toggle</li>
              <li style={{ marginBottom: '8px' }}>Navigate to the Qalam feedback page</li>
              <li style={{ marginBottom: '8px' }}>The extension will automatically detect and process unsubmitted surveys</li>
              <li style={{ marginBottom: '8px' }}>Surveys will be filled and submitted automatically</li>
            </ol>
          </div>

          {/* Warning */}
          {isEnabled && (
            <div style={{
              backgroundColor: 'rgba(113, 63, 18, 0.3)',
              border: '1px solid #a16207',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <p style={{
                color: '#fef08a',
                fontSize: '14px',
                margin: 0
              }}>
                ⚠️ <strong>Warning:</strong> Auto-fill is active. Surveys will be automatically submitted when you visit the feedback page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
