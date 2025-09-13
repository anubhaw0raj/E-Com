let users = []; // In-memory user storage for now
let userIdCounter = 1;

// library -> bcryptjs

// Register new user (POST /api/auth/register) -> username, email, password frontend se
// check if user exists -> return error -> login page 
// { userId, userName, email, hashed_password }
// iska jo function bnega usme jo password aayega usko tmkio hash krna hoga
// api response -> jo naya user banega {id, userName, email} -> if you want to directly go to home
// api response -> success message -> login page redirect krdo


// Login user (POST /api/auth/login) -> username, password
// check if user exists -> if no0 > return error and ask user to register
// password received -> usko hash kro aur compare kro already wala 
// match kr gya  -> api response -> {id, userName, email} 
// nhi match kiya to error message bhejo -> login failed

// [NOT NECESSARY] - Logout user (POST /api/auth/logout) -> username
// backend api banane ka jroorat nhi hai
// logout frontend me jo button hoga wo bs localStorage se user object hata dega