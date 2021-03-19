import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { KitProvider } from './Providers/Kit';
import { PatternStateProvider } from './Providers/Pattern';
import { TransportProvider } from './Providers/Transport';
import { InfoProvider } from './Providers/Info';
import { UndoProvider } from './Providers/UndoProvider';
import { ToneProvider } from './Providers/ToneProvider';
import { UserProvider } from './Providers/User';
import { PatternActionProvider } from './Providers/Actions/Pattern';
import { StatusProvider } from './Providers/Status';
import { LoginPage } from './Pages/LoginPage';
import { SequencerPage } from './Pages/Sequencer';
import { StatusBar } from './Sections/StatusBar';
import { PatternFunctionProvider } from './Providers/Functions/Pattern';

export default function App() {
  return (
    <StatusProvider>
      <UserProvider>
        <ToneProvider>
          <InfoProvider>
            <KitProvider>
              <UndoProvider>
                <PatternStateProvider>
                  <PatternFunctionProvider>
                    <PatternActionProvider>
                      <TransportProvider>
                        <Router>
                          <Switch>
                            <Route path='/' exact component={SequencerPage} />
                            <Route path='/login' component={LoginPage} />
                          </Switch>
                        </Router>
                        <StatusBar />
                      </TransportProvider>
                    </PatternActionProvider>
                  </PatternFunctionProvider>
                </PatternStateProvider>
              </UndoProvider>
            </KitProvider>
          </InfoProvider>
        </ToneProvider>
      </UserProvider>
    </StatusProvider>
  );
}

window.addEventListener('orientationchange', resize);
// window.addEventListener('blur', () => {
//   window.addEventListener('focus', resize);
// });

function resize() {
  var originalBodyStyle = getComputedStyle(document.body).getPropertyValue(
    'display'
  );
  document.body.style.display = 'none';
  setTimeout(function () {
    document.body.style.display = originalBodyStyle;
  }, 10);
  // window.removeEventListener('focus', resize);
}
