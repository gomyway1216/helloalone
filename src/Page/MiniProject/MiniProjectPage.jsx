import React from 'react';
import ProjectCard from '../../Component/Project/ProjectCard';
import predictionImage from '../../assets/image/prediction-image.png';

const MiniProjectPage = () => {

  return (
    <div>
      <ProjectCard 
        id="prediction-project"
        title="Prediction measure"
        image={predictionImage}
        description="This measures the accuracy of your prediction."/>
    </div>
  );
};

export default MiniProjectPage;