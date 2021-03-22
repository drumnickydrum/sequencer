import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserProvider } from './Providers/User';
import { StatusProvider } from './Providers/Status';
import { LoginPage } from './features/Login/LoginPage';
import { SequencerPage } from './features/sequencer/Sequencer';
import { StatusBar } from './features/StatusBar/StatusBar';

export default function App() {
  return (
    <StatusProvider>
      <UserProvider>
        <Router>
          <Switch>
            <Route path='/' exact component={SequencerPage} />
            <Route path='/login' component={LoginPage} />
          </Switch>
        </Router>
        <StatusBar />
      </UserProvider>
    </StatusProvider>
  );
}

window.addEventListener('orientationchange', resize);
// window.addEventListener('blur', () => {
//   window.addEventListener('focus', resize);
// });

function resize() {
  // var originalBodyStyle = getComputedStyle(document.body).getPropertyValue(
  //   'display'
  // );
  document.body.style.display = 'none';
  setTimeout(function () {
    document.body.style.display = 'initial';
  }, 10);
  // window.removeEventListener('focus', resize);
}
