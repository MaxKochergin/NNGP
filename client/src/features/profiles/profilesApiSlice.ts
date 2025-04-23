import { apiSlice } from '../../app/api/api.slice';
import {
  CreateEducationDto,
  CreateProfileDto,
  CreateProfileSkillDto,
  CreateProjectDto,
  CreateSocialMediaDto,
  CreateWorkExperienceDto,
  Education,
  Profile,
  ProfileSkill,
  Project,
  SocialMedia,
  UpdateProfileDto,
  WorkExperience,
} from '../../types/profile';

export const profilesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Профили
    getProfiles: builder.query<Profile[], void>({
      query: () => '/profiles',
      providesTags: ['Profile'],
    }),

    getProfileById: builder.query<Profile, string>({
      query: id => `/profiles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Profile', id }],
    }),

    getProfileByUserId: builder.query<Profile, string>({
      query: userId => `/profiles/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Profile', id: result?.id }],
    }),

    createProfile: builder.mutation<Profile, CreateProfileDto>({
      query: profileData => ({
        url: '/profiles',
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<Profile, { id: string; data: UpdateProfileDto }>({
      query: ({ id, data }) => ({
        url: `/profiles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Profile', id }],
    }),

    deleteProfile: builder.mutation<void, string>({
      query: id => ({
        url: `/profiles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    // Социальные сети
    getProfileSocialMedia: builder.query<SocialMedia[], string>({
      query: profileId => `/profiles/${profileId}/social-media`,
      providesTags: (result, error, profileId) => [
        { type: 'Profile', id: profileId },
        ...(result?.map(sm => ({ type: 'Profile' as const, id: sm.id })) || []),
      ],
    }),

    addSocialMedia: builder.mutation<SocialMedia, CreateSocialMediaDto>({
      query: socialMediaData => ({
        url: '/profiles/social-media',
        method: 'POST',
        body: socialMediaData,
      }),
      invalidatesTags: (result, error, { profileId }) => [{ type: 'Profile', id: profileId }],
    }),

    deleteSocialMedia: builder.mutation<void, string>({
      query: id => ({
        url: `/profiles/social-media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    // Навыки профиля
    getProfileSkills: builder.query<ProfileSkill[], string>({
      query: profileId => `/profiles/${profileId}/skills`,
      providesTags: (result, error, profileId) => [
        { type: 'Profile', id: profileId },
        ...(result?.map(skill => ({ type: 'Profile' as const, id: skill.id })) || []),
      ],
    }),

    addProfileSkill: builder.mutation<ProfileSkill, CreateProfileSkillDto>({
      query: skillData => ({
        url: '/profiles/skills',
        method: 'POST',
        body: skillData,
      }),
      invalidatesTags: (result, error, { profileId }) => [{ type: 'Profile', id: profileId }],
    }),

    deleteProfileSkill: builder.mutation<void, string>({
      query: id => ({
        url: `/profiles/skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    // Проекты
    getProfileProjects: builder.query<Project[], string>({
      query: profileId => `/profiles/${profileId}/projects`,
      providesTags: (result, error, profileId) => [
        { type: 'Profile', id: profileId },
        ...(result?.map(project => ({ type: 'Profile' as const, id: project.id })) || []),
      ],
    }),

    addProject: builder.mutation<Project, CreateProjectDto>({
      query: projectData => ({
        url: '/profiles/projects',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: (result, error, { profileId }) => [{ type: 'Profile', id: profileId }],
    }),

    deleteProject: builder.mutation<void, string>({
      query: id => ({
        url: `/profiles/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    // Опыт работы
    getProfileWorkExperience: builder.query<WorkExperience[], string>({
      query: profileId => `/profiles/${profileId}/work-experience`,
      providesTags: (result, error, profileId) => [
        { type: 'Profile', id: profileId },
        ...(result?.map(exp => ({ type: 'Profile' as const, id: exp.id })) || []),
      ],
    }),

    addWorkExperience: builder.mutation<WorkExperience, CreateWorkExperienceDto>({
      query: workExpData => ({
        url: '/profiles/work-experience',
        method: 'POST',
        body: workExpData,
      }),
      invalidatesTags: (result, error, { profileId }) => [{ type: 'Profile', id: profileId }],
    }),

    deleteWorkExperience: builder.mutation<void, string>({
      query: id => ({
        url: `/profiles/work-experience/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    // Образование
    getProfileEducation: builder.query<Education[], string>({
      query: profileId => `/profiles/${profileId}/education`,
      providesTags: (result, error, profileId) => [
        { type: 'Profile', id: profileId },
        ...(result?.map(edu => ({ type: 'Profile' as const, id: edu.id })) || []),
      ],
    }),

    addEducation: builder.mutation<Education, CreateEducationDto>({
      query: educationData => ({
        url: '/profiles/education',
        method: 'POST',
        body: educationData,
      }),
      invalidatesTags: (result, error, { profileId }) => [{ type: 'Profile', id: profileId }],
    }),

    deleteEducation: builder.mutation<void, string>({
      query: id => ({
        url: `/profiles/education/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  // Профили
  useGetProfilesQuery,
  useGetProfileByIdQuery,
  useGetProfileByUserIdQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  // Социальные сети
  useGetProfileSocialMediaQuery,
  useAddSocialMediaMutation,
  useDeleteSocialMediaMutation,
  // Навыки профиля
  useGetProfileSkillsQuery,
  useAddProfileSkillMutation,
  useDeleteProfileSkillMutation,
  // Проекты
  useGetProfileProjectsQuery,
  useAddProjectMutation,
  useDeleteProjectMutation,
  // Опыт работы
  useGetProfileWorkExperienceQuery,
  useAddWorkExperienceMutation,
  useDeleteWorkExperienceMutation,
  // Образование
  useGetProfileEducationQuery,
  useAddEducationMutation,
  useDeleteEducationMutation,
} = profilesApiSlice;
