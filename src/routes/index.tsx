import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import Home from '../pages/Home';
import NewRoom from '../pages/NewRoom';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
        <Route component={() => <Redirect to="/" />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
