import React from 'react';
import { MutatingDots } from 'react-loader-spinner';

const MutatingDotsLoader = () => {
    return ( // Add return statement here
        <MutatingDots
            visible={true}
            height="100"
            width="100"
            color="#4fa94d" // Base color
            secondaryColor="#4fa94d" // Secondary color, can change if desired
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}} // Add any custom styles here if needed
            wrapperClass="" // Add a class name if you want to apply additional styles
        />
    );
};

export default MutatingDotsLoader;
