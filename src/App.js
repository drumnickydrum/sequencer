import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { KitProvider } from './Providers/Kit';
import { PatternProvider } from './Providers/Pattern';
import { SequencerProvider } from './Providers/Sequencer';
import { InfoProvider } from './Providers/Info';
import { UndoProvider } from './Providers/UndoProvider';
import { ToneProvider } from './Providers/ToneProvider';
import { UserProvider } from './Providers/User';
import { StatusProvider } from './Providers/Status';
import { LoginPage } from './Pages/LoginPage';
import { SequencerPage } from './Pages/Sequencer';
import { StatusBar } from './Sections/StatusBar';

export default function App() {
  return (
    <StatusProvider>
      <UserProvider>
        <ToneProvider>
          <InfoProvider>
            <KitProvider>
              <UndoProvider>
                <PatternProvider>
                  <SequencerProvider>
                    <Router>
                      <Switch>
                        <Route path='/' component={SequencerPage} />
                        <Route path='/login' component={LoginPage} />
                      </Switch>
                    </Router>
                    <StatusBar />
                  </SequencerProvider>
                </PatternProvider>
              </UndoProvider>
            </KitProvider>
          </InfoProvider>
        </ToneProvider>
      </UserProvider>
    </StatusProvider>
  );
}

// window.addEventListener('orientationchange', resize);
// window.addEventListener('blur', () => {
//   window.addEventListener('focus', resize);
// });

// function resize() {
//   var originalBodyStyle = getComputedStyle(document.body).getPropertyValue(
//     'display'
//   );
//   document.body.style.display = 'none';
//   setTimeout(function () {
//     document.body.style.display = originalBodyStyle;
//   }, 10);
//   window.removeEventListener('focus', resize);
// }
