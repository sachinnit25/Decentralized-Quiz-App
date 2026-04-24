#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    symbol_short, Env, Symbol, Vec, Map, Address, String
};

// Storage keys
const ADMIN: Symbol = symbol_short!("ADMIN");
const QUIZZES: Symbol = symbol_short!("QUIZ");
const SCORES: Symbol = symbol_short!("SCORE");

#[contracttype]
#[derive(Clone)]
pub struct Quiz {
    pub question: String,
    pub options: Vec<String>,
    pub correct_answer: u32,
}

#[contract]
pub struct DecentralizedQuizApp;

#[contractimpl]
impl DecentralizedQuizApp {

    // Initialize contract
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
    }

    // Create quiz (admin only)
    pub fn create_quiz(
        env: Env,
        question: String,
        options: Vec<String>,
        correct_answer: u32,
    ) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        let mut quizzes: Vec<Quiz> =
            env.storage().instance().get(&QUIZZES).unwrap_or(Vec::new(&env));

        quizzes.push_back(Quiz {
            question,
            options,
            correct_answer,
        });

        env.storage().instance().set(&QUIZZES, &quizzes);
    }

    // Get quizzes
    pub fn get_quizzes(env: Env) -> Vec<Quiz> {
        env.storage()
            .instance()
            .get(&QUIZZES)
            .unwrap_or(Vec::new(&env))
    }

    // Submit answer
    pub fn submit_answer(
        env: Env,
        user: Address,
        quiz_index: u32,
        answer: u32,
    ) {
        user.require_auth();

        let quizzes: Vec<Quiz> =
            env.storage().instance().get(&QUIZZES).unwrap();

        if quiz_index >= quizzes.len() {
            panic!("Invalid quiz index");
        }

        let quiz = quizzes.get(quiz_index).unwrap();

        let mut scores: Map<Address, u32> =
            env.storage().instance().get(&SCORES).unwrap_or(Map::new(&env));

        let mut score = scores.get(user.clone()).unwrap_or(0);

        if answer == quiz.correct_answer {
            score += 1;
        }

        scores.set(user, score);
        env.storage().instance().set(&SCORES, &scores);
    }

    // Get score
    pub fn get_score(env: Env, user: Address) -> u32 {
        let scores: Map<Address, u32> =
            env.storage().instance().get(&SCORES).unwrap_or(Map::new(&env));

        scores.get(user).unwrap_or(0)
    }

    // Get admin
    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&ADMIN).unwrap()
    }
}
