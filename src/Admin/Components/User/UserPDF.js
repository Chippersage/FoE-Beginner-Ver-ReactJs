// UserPDF.js
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
    alignItems: 'center',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    padding: 5,
  },
  tableCol: {
    width: '20%',
    textAlign: 'center',
    fontSize: 10,
  },
  tableColHeader: {
    width: '20%',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
  },
});

const UserPDF = ({ users }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>User Details</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableColHeader}>S.No</Text>
          <Text style={styles.tableColHeader}>Student ID</Text>
          <Text style={styles.tableColHeader}>Name</Text>
          <Text style={styles.tableColHeader}>Email</Text>
          <Text style={styles.tableColHeader}>Mobile</Text>
        </View>
        {users.map((user, index) => (
          <View key={user.id} style={styles.tableRow}>
            <Text style={styles.tableCol}>{index + 1}</Text>
            <Text style={styles.tableCol}>{user.std}</Text>
            <Text style={styles.tableCol}>{user.name}</Text>
            <Text style={styles.tableCol}>{user.email}</Text>
            <Text style={styles.tableCol}>{user.mobile}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default UserPDF;
