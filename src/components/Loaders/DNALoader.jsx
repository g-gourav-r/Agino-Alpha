import React from 'react';
import { DNA } from 'react-loader-spinner';

const DNALoader = () => (
  <DNA
    visible={true}
    height="30" // Adjust size as needed
    width="30"
    ariaLabel="dna-loading"
    wrapperStyle={{ margin: '0 auto' }} // Centering the spinner
    wrapperClass="dna-wrapper"
  />
);

export default DNALoader;
