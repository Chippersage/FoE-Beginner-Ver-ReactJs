import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Stages.css';
import Stage7Img from '../Assets/images/boat.png';
import Stage1Img from '../Assets/images/duck.png';
import Stage6Img from '../Assets/images/flavor.png';
import Stage5Img from '../Assets/images/idea.png';
import Stage2Img from '../Assets/images/img2.jpg';
import Stage3Img from '../Assets/images/img3.jpg';
import Stage4Img from '../Assets/images/mental-health.png';
import { useAuth } from '../Context/AuthContext';
import { db } from '../Firebase/FirebaseConfig';


function Stages() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [completedActivities, setCompletedActivities] = useState({
    Stage1: {},
    Stage2: {},
    Stage3: {},
    Stage4: {},
    Stage5: {},
  });

  const [websiteStatus, setWebsiteStatus] = useState({
    Stage1: false,
    Stage2: false,
    Stage3: false,
    Stage4: false,
    Stage5: false,
  });

  const stages = ['Stage1', 'Stage2', 'Stage3', 'Stage4', 'Stage5'];

  const passages = {
    Stage1: [
      { name: 'TellMeNow5', img: Stage3Img },
      { name: 'TalkMeNowActivity5', img: Stage4Img },
      { name: 'TalkMeeNow6', img: Stage6Img },
      { name: 'TalkMeNowActivity6', img: Stage5Img},
      { name: 'TheBoat7', img: Stage7Img },
      { name: 'TheBoatActivity7', img: Stage5Img },
      { name: 'MeeToo8', img: Stage1Img },
      { name: 'MeeTooActivity8', img: Stage4Img },
    ],
    Stage2: [
      { name: 'website', img: Stage1Img },
      { name: 'TalkMeNowActivity', img: Stage2Img },
      { name: 'TalkMeNowActivity5', img: Stage3Img },
      { name: 'Jumbled words', img: Stage4Img },
      { name: 'Spelling', img: Stage5Img },
    ],
    Stage3: [
      { name: 'website', img: Stage1Img },
      { name: 'ActivityPage', img: Stage2Img },
      { name: 'Fill in the blanks', img: Stage3Img },
      { name: 'Jumbled words', img: Stage4Img },
      { name: 'Spelling', img: Stage5Img },
    ],
    Stage4: [
      { name: 'website', img: Stage1Img },
      { name: 'ActivityPage', img: Stage2Img },
      { name: 'Fill in the blanks', img: Stage3Img },
      { name: 'Jumbled words', img: Stage4Img },
      { name: 'Spelling', img: Stage5Img },
    ],
    Stage5: [
      { name: 'website', img: Stage1Img },
      { name: 'ActivityPage', img: Stage2Img },
      { name: 'Fill in the blanks', img: Stage3Img },
      { name: 'Jumbled words', img: Stage4Img },
      { name: 'Spelling', img: Stage5Img },
    ],
  };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const userDocRef = db.collection('score').doc(user.uid);
        const doc = await userDocRef.get();
        if (doc.exists) {
          const data = doc.data();
          const fetchedScores = data.scores || [];

          const updatedCompletedActivities = { ...completedActivities };

          fetchedScores.forEach(score => {
            const { passage, activity } = score;
            if (passage && activity) {
              const trimmedPassage = passage.trim();
              const matchedStage = stages.find(stage => trimmedPassage.toLowerCase() === stage.toLowerCase());
              if (matchedStage) {
                if (!updatedCompletedActivities[matchedStage]) {
                  updatedCompletedActivities[matchedStage] = {};
                }
                updatedCompletedActivities[matchedStage][activity] = true;
              }
            }
          });

          setCompletedActivities(updatedCompletedActivities);
        }
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    const fetchWebsiteStatus = async () => {
      try {
        const updatedWebsiteStatus = { ...websiteStatus };

        for (const stage of stages) {
          const passageCollectionName = stage.toLowerCase(); // Assuming collection names are lowercase like 'passage1', 'passage2', etc.
          const passageDocRef = db.collection(passageCollectionName).doc(user.uid);
          const doc = await passageDocRef.get();
          if (doc.exists) {
            const data = doc.data();
            if (data.status === 'completed') {
              updatedWebsiteStatus[stage] = true;
            }
          }
        }

        setWebsiteStatus(updatedWebsiteStatus);
      } catch (error) {
        console.error("Error fetching passage status:", error);
      }
    };

    fetchScores();
    fetchWebsiteStatus();
  }, [user.uid]);

  const handleStageClick = (stage) => {
    setSelectedStage(stage === selectedStage ? null : stage);
    setSelectedPassage(null);
  };

  const handlePassageClick = (passageName) => {
    setSelectedPassage(passageName);

    const navigationRoutes = {
      Stage1: {
        TellMeNow5: "/TellMeNow5",
        TalkMeNowActivity5 : "/TalkMeNowActivity5",
        TalkMeeNow6: "/TalkMeeNow6",
        TalkMeNowActivity6: "/TalkMeNowActivity6",
        TheBoat7: "/TheBoat7",
        TheBoatActivity7:"/TheBoatActivity7",
        MeeToo8: "/MeeToo8",
        MeeTooActivity8: "/MeeTooActivity8",
      },
      Stage2: {
        website: "/website2",
        TalkMeNowActivity: "/TalkMeNowActivity",
        TalkMeNowActivity5: "/TalkMeNowActivity5",
        "Jumbled words": "/Jumblewords2",
        Spelling: "/Spelling2"
      },
      Stage3: {
        website: "/website3",
        Vocabulary: "/ActivityPage",
        "Fill in the blanks": "/FillInTheBlank3",
        "Jumbled words": "/Jumblewords3",
        Spelling: "/Spelling3"
      },
      Stage4: {
        website: "/website4",
        Vocabulary: "/ActivityPage",
        "Fill in the blanks": "/FillInTheBlank4",
        "Jumbled words": "/Jumblewords4",
        Spelling: "/Spelling4"
      },
      Stage5: {
        website: "/website5",
        Vocabulary: "/ActivityPage",
        "Fill in the blanks": "/FillInTheBlank5",
        "Jumbled words": "/Jumblewords5",
        Spelling: "/Spelling5"
      },
    };

    const currentStageRoutes = navigationRoutes[selectedStage];
    if (currentStageRoutes && currentStageRoutes[passageName]) {
      navigate(currentStageRoutes[passageName]);
    }
  };

  const areAllActivitiesGreen = (stage) => {
    const stageActivities = passages[stage].map(passage => passage.name);
    return stageActivities.every(activity => completedActivities[stage][activity] || (activity === 'MeeToo8' && websiteStatus[stage]));
  };

  const isGreen = (stage, activity) => {
    if (activity === 'MeeToo8' && websiteStatus[stage]) {
      return true;
    }
    return completedActivities[stage] && completedActivities[stage][activity];
  };

  const isStageEnabled = (stageIndex) => {
    if (stageIndex === 0) return true; // First stage is always enabled

    // Enable the current stage only if the previous stage is fully completed
    const previousStage = stages[stageIndex - 1];
    return areAllActivitiesGreen(previousStage);
  };
  // const isStageEnabled = (stageIndex) => {
  //   return true; // Always enable all stages
  // };
  
  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Logout or redirect to a different page after inactivity
        alert('You have been logged out due to inactivity.');
        navigate('/'); // Replace with your login or logout path
      }, 600000); // 10 mins of inactivity
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    resetTimer();

    return () => {
        clearTimeout(inactivityTimer);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keydown', resetTimer);
    };
}, [navigate]);


  return (
    <div className="card-container">
      {stages.map((stage, index) => (
        <div className={`stage-container stage-${index}`} key={index}>
          <button
            className={`stage-button ${areAllActivitiesGreen(stage) ? 'green-filter' : ''} ${!isStageEnabled(index) ? 'disabled-button' : ''}`}
            onClick={() => handleStageClick(stage)}
            disabled={!isStageEnabled(index)}
          >
            {stage}
          </button>
          {selectedStage === stage && (
            <div className="passage-structure">
              <div className="passage-row">
                {passages[stage]?.map((passage, idx) => {
                  const greenFilter = isGreen(stage, passage.name) ? 'green-filter' : '';

                  return (
                    <div key={idx}>
                      <div
                        className={`passage-item ${greenFilter}`}
                        onClick={() => handlePassageClick(passage.name)}
                      >
                        <img src={passage.img} alt={passage.name} />
                      </div>
                      {idx < passages[stage].length - 1 && <div className="line" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Stages;
