import React, { ReactNode } from "react"
import AmplifyClient from "./client"
import '../../styles/global.css';

interface props {
  element: ReactNode
}

export default ({ element }: props) => (<AmplifyClient>{element}</AmplifyClient>);