export type UserRole = 'member' | 'teacher' | 'admin';
export type ActivityCategory = 'concert' | 'workshop' | 'dance' | 'talk' | 'other';
export type LessonLevel = 'all' | 'beginner' | 'intermediate' | 'advanced';
export type RegistrationStatus = 'confirmed' | 'waitlisted' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Edition {
  id: string;
  name: string;
  year: number;
  starts_on: string; // date
  ends_on: string; // date
  is_current: boolean;
  created_at: string;
}

export interface Stage {
  id: string;
  edition_id: string;
  name: string;
  color: string;
  sort_order: number;
}

export interface Artist {
  id: string;
  edition_id: string;
  name: string;
  style: string;
  bio: string;
  photo_url: string | null;
}

export interface Activity {
  id: string;
  edition_id: string;
  stage_id: string | null;
  artist_id: string | null;
  title: string;
  description: string;
  category: ActivityCategory;
  starts_at: string; // timestamptz
  ends_at: string; // timestamptz
  capacity: number | null;
}

export interface ActivityWithRelations extends Activity {
  stage: Stage | null;
  artist: Artist | null;
}

export interface ActivityRegistration {
  id: string;
  activity_id: string;
  user_id: string;
  created_at: string;
}

export interface Floorplan {
  id: string;
  edition_id: string;
  name: string;
  image_url: string | null;
}

export interface FloorplanPoi {
  id: string;
  floorplan_id: string;
  name: string;
  description: string;
  icon: string;
  x: number;
  y: number;
}

export interface InfoPage {
  id: string;
  slug: string;
  icon: string;
  sort_order: number;
  published: boolean;
  title_fr: string;
  title_en: string;
  body_fr: string;
  body_en: string;
}

export interface Lesson {
  id: string;
  season: string;
  title: string;
  description: string;
  level: LessonLevel;
  teacher_id: string | null;
  teacher_name: string;
  weekday: number; // 1 = Monday .. 7 = Sunday
  start_time: string; // 'HH:MM:SS'
  end_time: string;
  location: string;
  capacity: number | null;
  starts_on: string | null;
  ends_on: string | null;
  is_open: boolean;
}

export interface LessonRegistration {
  id: string;
  lesson_id: string;
  user_id: string;
  status: RegistrationStatus;
  created_at: string;
}

export interface LessonRegistrationWithProfile extends LessonRegistration {
  profile: Pick<Profile, 'id' | 'full_name'> | null;
}

export interface LessonCounts {
  lesson_id: string;
  confirmed: number;
  waitlisted: number;
}

export interface ActivityCounts {
  activity_id: string;
  registered: number;
}
