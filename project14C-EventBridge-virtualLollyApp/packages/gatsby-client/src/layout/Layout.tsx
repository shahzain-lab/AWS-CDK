import React from 'react';
import './Layout.css';

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return <div className='layout--box'>
    <h1 className="title"><a href="/">virtual lollipop</a></h1>
    <p className="subtitle">because we all know someone<br />who deserves some sugar.</p>
    {children}
    <footer><p>Built and hosted with <a href="https://netlify.com/">Netlify</a> by <a href="https://twitter.com/its_shahzain">shahzain</a></p></footer>

  </div>;
};

export default Layout;