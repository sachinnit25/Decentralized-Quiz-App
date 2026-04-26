#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String, Vec};

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, DecentralizedQuizApp);
    let client = DecentralizedQuizAppClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    assert_eq!(client.get_admin(), admin);
}

#[test]
fn test_create_quiz() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, DecentralizedQuizApp);
    let client = DecentralizedQuizAppClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let question = String::from_str(&env, "What is Stellar?");
    let mut options = Vec::new(&env);
    options.push_back(String::from_str(&env, "A planet"));
    options.push_back(String::from_str(&env, "A blockchain"));
    options.push_back(String::from_str(&env, "A coffee brand"));
    
    let correct_answer = 1; // "A blockchain"

    client.create_quiz(&question, &options, &correct_answer);

    let quizzes = client.get_quizzes();
    assert_eq!(quizzes.len(), 1);
    
    let quiz = quizzes.get(0).unwrap();
    assert_eq!(quiz.question, question);
    assert_eq!(quiz.correct_answer, correct_answer);
}

#[test]
fn test_submit_answer() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, DecentralizedQuizApp);
    let client = DecentralizedQuizAppClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    // Create a quiz
    let question = String::from_str(&env, "2 + 2?");
    let mut options = Vec::new(&env);
    options.push_back(String::from_str(&env, "3"));
    options.push_back(String::from_str(&env, "4"));
    let correct_answer = 1; // "4"
    client.create_quiz(&question, &options, &correct_answer);

    let user = Address::generate(&env);
    
    // Submit correct answer
    client.submit_answer(&user, &0, &1);
    assert_eq!(client.get_score(&user), 1);

    // Submit wrong answer (index 0 is "3")
    // Wait, the current implementation of submit_answer doesn't subtract points, it just increments if correct.
    // Let's verify it doesn't increment for wrong answer.
    client.submit_answer(&user, &0, &0);
    assert_eq!(client.get_score(&user), 1);
}

#[test]
#[should_panic(expected = "Invalid quiz index")]
fn test_invalid_quiz_index() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, DecentralizedQuizApp);
    let client = DecentralizedQuizAppClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let user = Address::generate(&env);
    client.submit_answer(&user, &99, &0);
}
