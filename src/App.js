import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { InfoProvider } from './Providers/Info';
import { UndoProvider } from './Providers/UndoProvider';
import { UserProvider } from './Providers/User';
import { StatusProvider } from './Providers/Status';
import { LoginPage } from './Pages/LoginPage';
import { SequencerPage } from './Pages/Sequencer';
import { StatusBar } from './Sections/StatusBar';

export default function App() {
  return (
    <StatusProvider>
      <UserProvider>
        <InfoProvider>
          <UndoProvider>
            <Router>
              <Switch>
                <Route path='/' exact component={SequencerPage} />
                <Route path='/login' component={LoginPage} />
              </Switch>
            </Router>
            <StatusBar />
          </UndoProvider>
        </InfoProvider>
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
