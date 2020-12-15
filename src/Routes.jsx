import React from 'react'
import { Redirect } from 'react-router-dom'
import { Route,  Switch } from 'react-router-dom'
import Home from './Page/Home'

const Routes = () => {
  return (
    <Switch>
      <Route path='/' component={Home} exact></Route>
    </Switch>
  )
}

export default Routes;