// TODO: ADD MORE SPECIFIC TYPES
export type ApplicationType = {
  id: number;
  reviews: Array<any>;
  reviewees: Array<any>;
};

export type ReviewType = {
  application: ApplicationType;
  finalscore: number;
  form: VentureFormType | MembershipFormType;
  referraL: number;
  review_type: "VENTURE" | "MEMBERSHIP";
};

export type MembershipFormType = {
  motivation: string;
  skill: number;
  fit: number;
  in_tumai: "YES" | "NO" | "MAYBE" | "DEFINITELY";
  comment_fit_tumai: string;
  timecommit: string;
  dept1_score: number;
  dept2_score: number;
  dept3_score: string;
  maybegoodfit: string;
  furthercomments: string;
};

export type VentureFormType = {
  relevance_ai: number;
  skills: number;
  profile_category:
    | "TECHNOLOGIST"
    | "BUSINESSMIND"
    | "DOMAINEXPERT"
    | "CREATIVETHINKER";
  motivation: number;
  vision: number;
  personality: number;
  like_to_see: "YES" | "NO" | "MAYBE";
  doubts: string;
  furthercomments: string;
};
