import React from "react"
import AmplifyClient from "./client"
import '../styles/global.css';


export const wrapRootElement = ({ element }) => (<AmplifyClient>{element}</AmplifyClient>);
