import React from 'react';
import Amplify from 'aws-amplify';
import awsmobile from '../aws-exports';

type Props = {
    children: React.ReactNode
}

const Client: React.FC<Props> = ({ children }) => {
    Amplify.configure(awsmobile);
    return (
        <div>{children}</div>
    )
}

export default Client;