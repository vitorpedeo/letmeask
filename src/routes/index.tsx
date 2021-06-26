import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import Home from '../pages/Home';
import NewRoom from '../pages/NewRoom';
import Room from '../pages/Room';
import AdminRoom from '../pages/AdminRoom';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/rooms/new" component={NewRoom} />
        <Route path="/rooms/:id" component={Room} />
        <Route path="/admin/rooms/:id" component={AdminRoom} />
        <Route component={() => <Redirect to="/" />} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
