import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './list-item.module.scss';
import { Link } from 'react-router-dom';

const CustomListItem = (props) => {
  const { id, name_english, name_japanese, name_japanese_ruby, image, voice_actor } = props.item;
  const voiceActor_name_english = voice_actor.name_english;
  const voiceActor_name_japanese = voice_actor.name_japanese;

  return (
    <div className={styles.root}>
      <div className={styles.imageContainer}>
        <img className={styles.image} src={image} alt="Image"/>
      </div>
      <div className={styles.text}>
        <div className={styles.mainText}>{name_english + ' / ' + name_japanese}</div>
        <Link className={styles.subText} 
          to={{
            pathname: '/voice-actor',
            state: {
              name: voiceActor_name_english + ' / ' + voiceActor_name_japanese
            }
          }}>{voiceActor_name_english + ' / ' + voiceActor_name_japanese}</Link>
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
    voice_actor: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name_english: PropTypes.string.isRequired,
      name_japanese: PropTypes.string.isRequired,
      name_japanese_ruby: PropTypes.string.isRequired,
      created: PropTypes.any.isRequired,
      lastUpdated: PropTypes.shape({
        nanoseconds: PropTypes.number.isRequired,
        seconds: PropTypes.number.isRequired
      })
    })
  })
};

export default CustomListItem;