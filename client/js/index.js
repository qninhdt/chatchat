//index.js
//script for index.html

import * as bootstrap from 'bootstrap';

import '../scss/styles.scss';

import { getCurUserInfo, navBarComps, getUserInfoById, getAllUsersInfo, getFriendsInfo } from './utils/common';

navBarComps();
