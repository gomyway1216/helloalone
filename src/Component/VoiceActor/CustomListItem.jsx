import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './list-item.module.scss';
import { Link } from 'react-router-dom';

const CustomListItem = (props) => {
  const { id, name_english, name_japanese, name_japanese_ruby, image, anime } = props.item;
  const anime_name_english = anime.name_english;
  const anime_name_japanese = anime.name_japanese;

  return (
    <div className={styles.root}>
      <div className={styles.imageContainer}>
        <img className={styles.image} src={image} alt="Image"/>
      </div>
      <div className={styles.text}>
        <div className={styles.mainText}>{name_english + ' / ' + name_japanese}</div>
        <Link className={styles.subText} 
          to={{
            pathname: '/anime',
            state: {
              name: anime_name_english + ' / ' + anime_name_japanese
            }
          }}>{anime_name_english + ' / ' + anime_name_japanese}</Link>
      </div>
    </div>
  );
};

CustomListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name_english: PropTypes.string.isRequired,
    name_japanese: PropTypes.string.isRequired,
    name_japanese_ruby: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    voice_actor_id: PropTypes.string.isRequired,
    anime: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name_english: PropTypes.string.isRequired,
      name_japanese: PropTypes.string.isRequired,
      name_japanese_ruby: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      created: PropTypes.any.isRequired,
      lastUpdated: PropTypes.shape({
        nanoseconds: PropTypes.number.isRequired,
        seconds: PropTypes.number.isRequired
      }),
      mainImage: PropTypes.string.isRequired
    })
  })
};

export default CustomListItem;