// lib/FontAwesome.js
import { config, library } from '@fortawesome/fontawesome-svg-core';
import {
    faHouse,
    faCircleUser,
    faBook,
    faNewspaper,
    faHandshake,
    faEnvelope,
    faBars,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;
library.add(
    faHouse,
    faCircleUser,
    faBook,
    faNewspaper,
    faHandshake,
    faEnvelope,
    faBars,
    faXmark
);
