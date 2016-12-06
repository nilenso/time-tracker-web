import React from 'react';
import { SignIn } from './containers/SignIn';
import { Link } from 'react-router';

export function App(props) {
  return (
    <div>
      <SignIn>
        <header>
          <nav>
            <ul>
              <li>time tracker</li>
              <li><Link to="/about">about</Link></li>
              <li><Link to="/timers">timers</Link></li>
            </ul>
          </nav>
        </header>
        <section>
          {props.children}
        </section>
        <footer>
          <nav>
            <ul>
              <li>{'made with ❤'}</li>
            </ul>
          </nav>
        </footer>
      </SignIn>
    </div>
  );
}
