export interface UserProfile {
    id: string;
    user_id: string;
    full_name: string;
    gender: string;
    date_of_birth: string;
    pan_no: string;
    email: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
    occupation: string;
    industry: string;
    annual_income: string;
    profile_pic_url: string;
}
  
export interface UserPreferences {
  id: string;
  user_id: string;
  pref1: string;
  pref2: string;
  pref3: string;
}
  
export interface UserWatchlist {
    id: string;
    user_id: string;
    watchlist1: string;
    watchlist2: string;
    watchlist3: string;
    watchlist4: string;
    watchlist5: string;
}