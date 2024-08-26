import React, { useEffect, useState } from 'react';
import { Pagination } from "react-bootstrap"; // Import the CSS file
import Header from '../../../Admin/Components/Header/Header';
import Sidebar from '../../../Admin/Components/Sidebar/Sidebar';
import { useAuth } from '../../../Components/Context/AuthContext';
import { db } from '../../../Components/Firebase/FirebaseConfig';
import '../../../Styles/Components/Scores.css';

const Scores = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [userNames, setUserNames] = useState({}); // Store user names and student IDs with ID as key
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchScoresDetails = async () => {
      try {
        // Fetch scores data
        const scoresCollection = await db.collection('scores').get();
        const scoresData = scoresCollection.docs.map(doc => ({
          id: doc.id,
          scores: doc.data().scores || []
        }));

        // Flatten all scores into a single array and add userId to each score
        const allScores = scoresData.flatMap(scoreDoc => 
          (scoreDoc.scores || []).map(score => ({
            ...score,
            userId: scoreDoc.id
          }))
        );

        // Sort the scores by date and startTime in descending order
        allScores.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;
          if (a.startTime > b.startTime) return -1;
          if (a.startTime < b.startTime) return 1;
          return 0;
        });

        setScores(allScores);

        // Collect unique user IDs from sorted scores
        const userIds = Array.from(new Set(allScores.map(score => score.userId)));
        console.log("User IDs to fetch:", userIds);

        // Fetch user names and student IDs based on user IDs
        const userPromises = userIds.map(id =>
          db.collection('users').doc(id).get().then(userDoc => {
            if (userDoc.exists) {
              console.log(`Fetched user ${id}:`, userDoc.data());
              return { id: id, name: userDoc.data().name, studentId: userDoc.data().id, mobile: userDoc.data().mobile };
            } else {
              console.warn(`No user found for ID ${id}`);
              return { id: id, name: 'Unknown', studentId: 'Unknown' };
            }
          })
        );

        const usersData = await Promise.all(userPromises);
        const usersMap = usersData.reduce((acc, user) => {
          acc[user.id] = { name: user.name, studentId: user.studentId, mobile: user.mobile };
          return acc;
        }, {});

        console.log("User names and student IDs map:", usersMap);
        setUserNames(usersMap);

      } catch (error) {
        console.error("Error fetching Scores or Users:", error);
      }
    };

    fetchScoresDetails();
  }, []);

  // Filter scores based on the search query
  const filteredScores = scores.filter(score => {
    const userId = userNames[score.userId]?.studentId || 'Unknown';
    const userName = userNames[score.userId]?.name || 'Unknown';
    const mobile = userNames[score.userId]?.mobile || 'Unknown';
    return (
      userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      score.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      score.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastScore = currentPage * pageSize;
  const indexOfFirstScore = indexOfLastScore - pageSize;
  const currentScores = filteredScores.slice(indexOfFirstScore, indexOfLastScore);

  const totalPages = Math.ceil(filteredScores.length / pageSize);

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return (
      <Pagination>
        <Pagination.Prev
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {pages}
        <Pagination.Next
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="score-table-container">
        <div className="score-table-header">
          <h2 className='score-table-heading'>Score Details</h2>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="score-search-input"
          />
        </div>
        <div className='table-main'>
          <table className='score_table_main'>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Activity</th>
                <th>Total Questions</th>
                <th>Correct Answers</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End time</th>
                <th>Questions</th> {/* New column for Questions */}
              </tr>
            </thead>
            <tbody>
              {currentScores.map((score, index) => (
                <tr key={`${score.userId}-${index}`}>
                  <td>{indexOfFirstScore + index + 1}</td> {/* Continuous serial numbers */}
                  <td>{userNames[score.userId]?.studentId || 'Unknown'}</td>
                  <td>{userNames[score.userId]?.name || 'Unknown'}</td>
                  <td>{userNames[score.userId]?.mobile || 'Unknown'}</td>
                  <td>{score.activity}</td>
                  <td>{score.totalQuestions}</td>
                  <td>{score.correctAnswers}</td>
                  <td>{score.duration}</td>
                  <td>{score.date}</td>
                  <td>{score.startTime}</td>
                  <td>{score.endTime}</td>
                  <td>
                    <ul>
                      {score.questionScores?.map((q, qIndex) => (
                        <li key={qIndex}>
                          Question {q.questionNumber}: Score {q.score}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center mt-2">
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default Scores;
