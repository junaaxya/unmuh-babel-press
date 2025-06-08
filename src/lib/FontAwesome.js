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
    faMagnifyingGlass,
    faArrowRight,
    faCalendarDays,
    faMapMarkerAlt,
    faPhone,
    faClock,
    faPlay,
    
} from '@fortawesome/free-solid-svg-icons';

import {
    faFacebookF,
    faTwitter,
    faInstagram,
    faYoutube,
    faLinkedinIn,
    
} from '@fortawesome/free-brands-svg-icons';

config.autoAddCss = false;
library.add(
    faHouse,
    faCircleUser,
    faBook,
    faNewspaper,
    faHandshake,
    faEnvelope,
    faBars,
    faXmark,
    faMagnifyingGlass,
    faArrowRight,
    faCalendarDays,
    faFacebookF,
    faTwitter,
    faInstagram,
    faYoutube,
    faLinkedinIn,
    faMapMarkerAlt,
    faPhone,
    faClock,
    faPlay
);
