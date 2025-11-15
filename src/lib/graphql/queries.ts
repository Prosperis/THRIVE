import { gql } from '@apollo/client';

// Applications queries
export const GET_APPLICATIONS = gql`
  query GetApplications {
    applications {
      id
      companyName
      position
      status
      targetDate
      appliedDate
      firstInterviewDate
      offerDate
      responseDeadline
      location
      workType
      employmentType
      salaryMin
      salaryMax
      salaryCurrency
      salaryPeriod
      jobUrl
      jobDescription
      notes
      tags
      priority
      source
      referralName
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

export const GET_APPLICATION_BY_ID = gql`
  query GetApplication($id: ID!) {
    application(id: $id) {
      id
      companyName
      position
      status
      targetDate
      appliedDate
      firstInterviewDate
      offerDate
      responseDeadline
      location
      workType
      employmentType
      salaryMin
      salaryMax
      salaryCurrency
      salaryPeriod
      jobUrl
      jobDescription
      notes
      tags
      priority
      source
      referralName
      sortOrder
      createdAt
      updatedAt
      interviews {
        id
        round
        type
        status
        scheduledAt
        duration
        location
        meetingUrl
        preparationNotes
        questionsAsked
        questionsToAsk
        feedback
        followUpSent
        followUpDate
        result
        createdAt
        updatedAt
      }
      linkedDocuments {
        documentId
        documentName
        documentType
        version
        versionName
        linkedAt
        content
      }
    }
  }
`;

export const CREATE_APPLICATION = gql`
  mutation CreateApplication($input: ApplicationInput!) {
    createApplication(input: $input) {
      id
      companyName
      position
      status
      targetDate
      appliedDate
      location
      workType
      employmentType
      salaryMin
      salaryMax
      salaryCurrency
      salaryPeriod
      jobUrl
      jobDescription
      notes
      tags
      priority
      source
      referralName
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_APPLICATION = gql`
  mutation UpdateApplication($id: ID!, $input: ApplicationUpdateInput!) {
    updateApplication(id: $id, input: $input) {
      id
      companyName
      position
      status
      targetDate
      appliedDate
      firstInterviewDate
      offerDate
      responseDeadline
      location
      workType
      employmentType
      salaryMin
      salaryMax
      salaryCurrency
      salaryPeriod
      jobUrl
      jobDescription
      notes
      tags
      priority
      source
      referralName
      sortOrder
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_APPLICATION = gql`
  mutation DeleteApplication($id: ID!) {
    deleteApplication(id: $id)
  }
`;

// Interviews queries
export const GET_INTERVIEWS = gql`
  query GetInterviews {
    interviews {
      id
      applicationId
      round
      type
      status
      scheduledAt
      duration
      location
      meetingUrl
      preparationNotes
      questionsAsked
      questionsToAsk
      feedback
      followUpSent
      followUpDate
      result
      createdAt
      updatedAt
      application {
        id
        companyName
        position
        status
      }
    }
  }
`;

export const CREATE_INTERVIEW = gql`
  mutation CreateInterview($input: InterviewInput!) {
    createInterview(input: $input) {
      id
      applicationId
      round
      type
      status
      scheduledAt
      duration
      location
      meetingUrl
      preparationNotes
      questionsAsked
      questionsToAsk
      feedback
      followUpSent
      followUpDate
      result
      createdAt
      updatedAt
    }
  }
`;

// Companies queries
export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      website
      industry
      size
      location
      founded
      remotePolicy
      description
      culture
      cultureNotes
      techStack
      benefits
      pros
      cons
      notes
      employeeReviews
      newsAndUpdates
      competitorComparison
      companyLinks
      ratings
      atsParams
      interviewProcess
      interviewDifficulty
      interviewExperience
      salaryRange
      status
      priority
      researched
      tags
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CompanyInput!) {
    createCompany(input: $input) {
      id
      name
      website
      industry
      size
      location
      founded
      remotePolicy
      description
      culture
      cultureNotes
      techStack
      benefits
      pros
      cons
      notes
      employeeReviews
      newsAndUpdates
      competitorComparison
      companyLinks
      ratings
      atsParams
      interviewProcess
      interviewDifficulty
      interviewExperience
      salaryRange
      status
      priority
      researched
      tags
      createdAt
      updatedAt
    }
  }
`;

// Contacts queries
export const GET_CONTACTS = gql`
  query GetContacts {
    contacts {
      id
      name
      companyId
      companyName
      title
      email
      phone
      linkedin
      notes
      relationship
      createdAt
      updatedAt
      company {
        id
        name
      }
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation CreateContact($input: ContactInput!) {
    createContact(input: $input) {
      id
      name
      companyId
      companyName
      title
      email
      phone
      linkedin
      notes
      relationship
      createdAt
      updatedAt
    }
  }
`;

// Documents queries
export const GET_DOCUMENTS = gql`
  query GetDocuments {
    documents {
      id
      name
      type
      fileName
      fileUrl
      url
      fileSize
      mimeType
      content
      version
      versionName
      baseDocumentId
      applicationId
      usedInApplicationIds
      lastUsedDate
      tags
      notes
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($input: DocumentInput!) {
    createDocument(input: $input) {
      id
      name
      type
      fileName
      fileUrl
      url
      fileSize
      mimeType
      content
      version
      versionName
      baseDocumentId
      applicationId
      usedInApplicationIds
      lastUsedDate
      tags
      notes
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

// Analytics queries
export const GET_APPLICATION_STATS = gql`
  query GetApplicationStats {
    applicationStats {
      total
      byStatus
      averageResponseTime
      successRate
      activeApplications
      interviewsScheduled
      offersReceived
    }
  }
`;

export const GET_APPLICATIONS_BY_STATUS_COUNT = gql`
  query GetApplicationsByStatusCount {
    applicationsByStatusCount
  }
`;

export const GET_APPLICATIONS_OVER_TIME = gql`
  query GetApplicationsOverTime($startDate: Date!, $endDate: Date!) {
    applicationsOverTime(startDate: $startDate, endDate: $endDate) {
      created_at
      status
    }
  }
`;
