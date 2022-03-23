import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './Page/Home/HomePage';
import CreateBlogPage from './Page/Blog/CreateBlogPage';
import BlogListPage from './Page/Blog/BlogListPage';
import RankingPage from './Page/Ranking/RankingPage';
import BlogPage from './Page/Blog/BlogPage';
import TaskListPage from './Page/Task/TaskListPage';
import SignUpPage from './Page/SignUp/SignUpPage';
import SignInPage from './Page/SignIn/SignInPage';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import MyPage from './Page/MyPage/MyPage';
import ForgotPasswordPage from './Page/ForgotPassword/ForgotPasswordPage';
import ChatGroupPage from './Page/Chat/ChatGroupListPage';
import ChatPage from './Page/Chat/ChatPage';
import MiniProjectPage from './Page/MiniProject/MiniProjectPage';
import PredictionProjectPage from './Page/MiniProject/PredictionProjectPage';
import AnimePage from './Page/Anime/AnimePage';
import CreateItemPage from './Page/Anime/CreateItemPage';
import AddTagPage from './Page/Anime/AddTagPage';
import InvalidPage from './Page/Invalid/InvalidPage';
<<<<<<< HEAD
import TestSignInPage from './Page/Test/Login';
import TestSignUpPage from './Page/Test/Register';
import HomPage from './Page/Test/Home';
import Profile from './Page/Test/Profile';
import BoardAdmin from './Page/Test/BoardAdmin';
import BoardUser from './Page/Test/BoardUser';
import BoardModerator from './Page/Test/BoardModerator';
import FriendsPage from './Page/Friend/FriendsPage';
import FriendPage from './Page/Friend/FriendPage';
import AddFriendPage from './Page/Friend/AddFriendPage';
import VoiceActorListPage from './Page/VoiceActor/VoiceActorListPage';
import VoiceActorPage from './Page/VoiceActor/VoiceActorPage';
import AddVoiceActorPage from './Page/VoiceActor/AddVoiceActorPage';
import AnimeCharacterListPage from './Page/Anime/AnimeCharacterListPage';
import AddAnimeCharacterPage from './Page/Anime/AddAnimeCharacterPage';
=======
>>>>>>> parent of ead321b (adding friends page)

const Routes = () => {
  return (
    <div className="page-container">
      <Switch>
        <Route path='/' component={HomePage} exact />
        <PrivateRoute path='/mypage' component={MyPage} />
        <AdminRoute path='/edit-blog-item' component={CreateBlogPage} />
        <Route path='/blog' component={BlogListPage} exact />
        <Route path='/blog/:id' component={BlogPage} />
        <PrivateRoute path='/ranking' component={RankingPage} />
        <AdminRoute path='/task' component={TaskListPage} />
        <PrivateRoute path='/chat' component={ChatGroupPage} exact />
        <PrivateRoute path='/chat/:id' component={ChatPage} />
        <Route path='/signup' component={SignUpPage} />
        <Route path='/signin' component={SignInPage} />
        <Route path='/forgot-password' component={ForgotPasswordPage} />
        <Route path='/mini-project' component={MiniProjectPage} />
        <Route path='/prediction-project' component={PredictionProjectPage} />
        <Route path='/anime' component={AnimePage} />
        <AdminRoute path='/edit-anime-item' component={CreateItemPage} />
        <AdminRoute path='/add-tag' component={AddTagPage} />
        <Route path='/invalid' component={InvalidPage} />
<<<<<<< HEAD
        <Route path='/testsignin' component={TestSignInPage} />
        <Route path='/testsignup' component={TestSignUpPage} />
        <Route path='/testuser' component={BoardUser} />
        <Route path='/hom' component={HomPage} />
        <Route path='/profile' component={Profile} />
        <Route path='/board' component={BoardModerator} />
        <Route path="/admin" component={BoardAdmin} />
        <Route path="/friends" component={FriendsPage} exact/>
        <Route path="/add-friend" component={AddFriendPage} />
        <PrivateRoute path='/friends/:id' component={FriendPage} />
        <Route path='/voice-actor' component={VoiceActorListPage} exact />
        <Route path='/voice-actor/:id' component={VoiceActorPage} />
        <AdminRoute path='/edit-voice-actor' component={AddVoiceActorPage} />
        <Route path='/anime-character' component={AnimeCharacterListPage} exact />
        <AdminRoute path='/edit-anime-character' component={AddAnimeCharacterPage} />
=======
>>>>>>> parent of ead321b (adding friends page)
      </Switch>
    </div>
  );
};

export default Routes;

