// // ActivitiesHeader.js
// import React, { useContext } from 'react';
// import { ScoreContext } from '../Context/ScoreContext'; // Corrected path

// const ActivitiesHeader = () => {  // Corrected component name
//   const { score, timer } = useContext(ScoreContext);

//   return (
//     <header>
//       <div>Score: {score}</div>
//       <div>Timer: {timer}</div>
//     </header>
//   );
// };

// export default ActivitiesHeader;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { db } from '../Firebase/FirebaseConfig'; // Adjust the path as needed

const Header = () => {
    const { user } = useAuth();
    const [cumulativeScore, setCumulativeScore] = useState(0);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const userDoc = await db.collection('score').doc(user.uid).get();
                const userData = userDoc.data();
                setCumulativeScore(userData ? userData.cumulativeScore || 0 : 0);
            } catch (error) {
                console.error('Error fetching score data:', error);
            }
        };

        if (user) {
            fetchScore();
        }
    }, [user]);

    return (
        <header>
            <h1>My Quiz App</h1>
            <div className="score-display">
                Cumulative Score: {cumulativeScore}
            </div>
        </header>
    );
};

export default Header;
