import apiClient from './client';

export const pipelineApi = {
    parse: (pipeline) => {
        return apiClient.post('/pipelines/parse', pipeline);
    }
};
