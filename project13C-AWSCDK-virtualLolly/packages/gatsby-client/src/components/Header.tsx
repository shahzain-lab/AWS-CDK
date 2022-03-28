import { navigate } from 'gatsby';
import React from 'react';
import './Header.css';
import Lolly from './Lolly'

const Header = () => {
    return <div className="Header">
        <div className='header--lolly'>
            <Lolly fillLollyTop="#fa73d9" fillLollyMiddle="#fac219" fillLollyBottom="#fa43d2" />
            <Lolly fillLollyTop="#d23a62" fillLollyMiddle="#e97393" fillLollyBottom="#ed265b" />
            <Lolly fillLollyTop="#f77249" fillLollyMiddle="#d12d32" fillLollyBottom="#fa7fff" />
            <Lolly fillLollyTop="#feefd6" fillLollyMiddle="#eeaaff" fillLollyBottom="#d45621" />
            <Lolly fillLollyTop="#d5cfd1" fillLollyMiddle="#defdde" fillLollyBottom="#cd2753" />
        </div>
        <button className='btn--lolly' onClick={() => navigate('/newLolly')} >Freez new lolly to send to a friend</button>
    </div >;
};

export default Header;