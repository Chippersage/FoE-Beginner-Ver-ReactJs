// App.js
import React from 'react';
import { ScoreProvider } from '../Context/ScoreContext'; // Corrected import
import MeeTooActivity8 from '../Mee too/MeeTooActivity8';
import TalkMeNowActivity6 from '../TalkMeNow6/TalkMeNowActivity6';
import TalkMeNowActivity5 from '../TellMeNow5/TalkMeNowActivity5';
import ActivitiesHeader from './ActivitiesHeader';

const App = () => {
  return (
    <ScoreProvider>  {/* Corrected wrapper */}
      <ActivitiesHeader />
      <MeeTooActivity8 />
      <TalkMeNowActivity6 />
      <TalkMeNowActivity5 />
      {/* Add other activities here */}
    </ScoreProvider>
  );
};

export default App;
