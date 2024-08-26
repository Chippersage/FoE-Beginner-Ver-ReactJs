import React from 'react';
import { Page, Document, StyleSheet, Text, View, Font } from '@react-pdf/renderer';

// Register font if needed (example with Roboto)
Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    padding: 5,
  },
  section: {
    margin: 5,
    padding: 5,
    flexGrow: 1,
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Roboto',
    textAlign: 'center'
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    color: 'black',
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'left',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    padding: 5,
  },
  tableCol: {
    width: '10%',
    textAlign: 'center',
    fontSize: 10,
  },
});

const ScoresPDF = ({ scores, userNames }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Score Details</Text>
        <View style={styles.tableHeader}>
          <Text style={{ width: '8%', fontSize: "10px", textAlign: 'center' }}>S.No</Text>
          <Text style={styles.tableCol}>Student ID</Text>
          <Text style={styles.tableCol}>Name</Text>
        
          <Text style={styles.tableCol}>Passage</Text>
          <Text style={styles.tableCol}>Passage Name</Text>
          <Text style={{ width: '10%', fontSize: "10px", textAlign: 'center' }}>Activity</Text>
          <Text style={{ width: '10%', fontSize: "10px", textAlign: 'center', marginLeft: '5px'}}>Total Questions</Text>
          <Text style={styles.tableCol}>Mobile</Text>
          <Text style={styles.tableCol}>Correct Answers</Text>
          <Text style={styles.tableCol}>Duration</Text>
          <Text style={{ width: '12%', fontSize: "10px", textAlign: 'center', marginLeft: "-3px" }}>Date</Text>
          <Text style={{ width: '12%', fontSize: "10px", textAlign: 'center'}}>Start Time</Text>
          <Text style={{ width: '12%', fontSize: "10px", textAlign: 'center' }}>End Time</Text>
        </View>
        {scores.map((score, index) => (
          <View key={`${score.userId}-${index}`} style={styles.tableRow}>
            <Text style={{ width: '8%', fontSize: "10px", textAlign: 'center' }}>{index + 1}</Text>
            <Text style={styles.tableCol}>{userNames[score.userId]?.studentId || 'Unknown'}</Text>
            <Text style={styles.tableCol}>{userNames[score.userId]?.name || 'Unknown'}</Text>
            
            <Text style={styles.tableCol}>{score.passage || 'N/A'}</Text>
            <Text style={styles.tableCol}>{score.passagename || 'N/A'}</Text>
            <Text style={styles.tableCol}>{score.activity}</Text>
            <Text style={styles.tableCol}>{score.totalQuestions}</Text>
            <Text style={styles.tableCol}>{userNames[score.userId]?.mobile || 'Unknown'}</Text>
            <Text style={styles.tableCol}>{score.correctAnswers}</Text>
            <Text style={styles.tableCol}>{score.duration}</Text>
            <Text style={{width: '12%', fontSize: "10px", textAlign: 'center', marginLeft: '-5px'}}>{score.date}</Text>
            <Text style={styles.tableCol}>{score.startTime}</Text>
            <Text style={{width: '10%', fontSize: "10px", textAlign: 'center', marginLeft: '5px'}}>{score.endTime}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default ScoresPDF;
