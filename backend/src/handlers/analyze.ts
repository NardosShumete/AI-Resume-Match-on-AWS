import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { analyzeResume } from '../analysis/engine';

interface AnalyzeRequest {
  resumeText?: string;
  jobDescription?: string;
  targetJobTitle?: string;
  targetCompany?: string;
}

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    console.log('Received analysis request', { requestId: event.requestContext.requestId });
    
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Request body is required.'
          }
        })
      };
    }

    let payload: AnalyzeRequest;
    try {
      payload = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Request body must be valid JSON.'
          }
        })
      };
    }

    const { resumeText, jobDescription, targetJobTitle, targetCompany } = payload;

    if (!resumeText || !jobDescription) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Resume text and job description are required.'
          }
        })
      };
    }
    
    // Limits
    if (resumeText.length > 50000 || jobDescription.length > 50000) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: {
            code: 'PAYLOAD_TOO_LARGE',
            message: 'Input text exceeds the maximum allowed length.'
          }
        })
      };
    }

    const startTime = Date.now();
    
    // Call the shared analysis engine
    const analysis = await analyzeResume(
      resumeText,
      jobDescription,
      'Resume', // A fallback if file name isn't provided from frontend
      targetCompany || 'Target Company',
      targetJobTitle || 'Target Role'
    );
    
    const duration = Date.now() - startTime;
    console.log('Analysis completed', { durationMs: duration, atsScore: analysis.atsScore });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        analysis
      })
    };
  } catch (error) {
    console.error('Unhandled error during analysis', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: {
          code: 'ANALYSIS_FAILED',
          message: 'Resume analysis is temporarily unavailable.'
        }
      })
    };
  }
};
