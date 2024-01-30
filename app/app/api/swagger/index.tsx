import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import spec from '../../../swagger'; 
import React from 'react';

const SwaggerPage = () => <SwaggerUI spec={spec} />;

export default SwaggerPage;
