import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './custom-item.module.scss';
import { Link } from 'react-router-dom';

const CustomListItem = (props) => {
  const { id, firstName, middleName, lastName, firstNameNative, lastNameNative,
    firstNameNativePhonetic, lastNameNativePhonetic, gender, birthday, profileImageLink,
    otherImageLinks, shortDescription, description, socialMedias, phoneNumber, emailAddress,
    created, lastUpdated, locationMet, activities, nationality, favoriteFoods, hobbies,
    colleges, jobs } = props.item;

  return (
    <div className={styles.root}>
      <div className={styles.imageContainer}>
        <img className={styles.image} src={profileImageLink} alt="Image"/>
      </div>
      <div className={styles.text}>
        <div className={styles.mainText}>{firstName + ' ' + lastName + ' / ' + firstNameNative + ' ' + lastNameNative}</div>
        <div className={styles.subText}>{shortDescription}</div>
      </div>
    </div>
  );
};

CustomListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    firstNameNative: PropTypes.string.isRequired,
    lastNameNative: PropTypes.string.isRequired,
    firstNameNativePhonetic: PropTypes.string, 
    lastNameNativePhonetic: PropTypes.string,
    gender: PropTypes.string.isRequired,
    birthday: PropTypes.Date,
    profileImageLink: PropTypes.string,
    otherImageLinks: PropTypes.array,
    shortDescription: PropTypes.string.isRequired,
    description: PropTypes.string,
    socialMedias: PropTypes.any,
    phoneNumber: PropTypes.number,
    emailAddress: PropTypes.string,
    created: PropTypes.Date,
    lastUpdated: PropTypes.Date,
    locationMet: PropTypes.any,
    activities: PropTypes.array,
    nationality: PropTypes.any,
    favoriteFoods: PropTypes.array,
    hobbies: PropTypes.array,
    colleges: PropTypes.array,
    jobs: PropTypes.array
  })
};

export default CustomListItem;