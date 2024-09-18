// libraries.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


// 필요한 아이콘 라이브러리를 추가하세요
import {
    faQuestion,
    faPenToSquare as fasPenToSquare,
    faRotateRight as fasRotateRight,
    faMagnifyingGlass as fasMagnifyingGlass,
    faChevronLeft as fasChevronLeft,
    faXmark as fasXmark,
    faXmarkCircle as fasXmarkCircle,
    faBars as fasBars,
    faCircleArrowUp as fasCircleArrowUp,
    faCircleExclamation as fasCircleExclamation,
    faEllipsis as fasEllipsis,
    faStar as fasStar,
    faBan as fasBan,
    faRightFromBracket as fasRightFromBracket,
    faGear as fasGear,
    faScrewdriverWrench as fasScrewdriverWrench,
    faUserPlus as fasUserPlus,
    faCamera as fasCamera,
    faReply as fasReply,
    faPlus as fasPlus,
    faPencil as fasPencil,
    faHouse as fasHouse,
    faComment as fasComment,
    faUser as fasUser,
    faShareNodes as fasShareNodes,

} from '@fortawesome/free-solid-svg-icons';

import {
    faPenToSquare as farPenToSquare,
    faUser as farUser,
    faEnvelope as farEnvelope,
    faImage as farImage,
    faStar as farStar,
    faBell as farBell,
    faBellSlash as farBellSlash,
    faFlag as farFlag,
    faHandshake as farHandshake,
    // faHouse as farHouse,

} from '@fortawesome/free-regular-svg-icons';


// 사용할 아이콘을 라이브러리에 추가하세요
library.add(faQuestion
    , fasPenToSquare
    , farPenToSquare
    , fasRotateRight
    , fasMagnifyingGlass
    , fasChevronLeft
    , fasXmark
    , fasXmarkCircle
    , fasBars
    , fasCircleArrowUp
    , fasCircleExclamation
    , fasEllipsis
    , fasStar
    , fasBan
    , fasRightFromBracket
    , fasGear
    , fasScrewdriverWrench
    , fasUserPlus
    , fasCamera
    , fasReply
    , fasPlus
    , fasPencil
    , fasHouse
    , fasComment
    , fasUser
    , fasShareNodes
);

library.add(farPenToSquare
    , farUser
    , farEnvelope
    , farImage
    , farStar
    , farBell
    , farBellSlash
    , farFlag
    , farHandshake
);

export { FontAwesomeIcon };