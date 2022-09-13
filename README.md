# Foresight Test Kit Action

A GitHub Action to analyze test and/or coverage results. Foresight’s Test Kit action integrates with your Github Actions pipelines.

- It makes simple to see failed tests, visualize performance of your tests and see their logs. It is the fastest way to access a failed test results in your workflow runs.
- It correlates the changes to the codebase with the test coverage reports to determine how much of the changes are covered by the tests.

You need to integrate Test Kit action to your CI pipeline in order to use [Test Monitoring](https://foresight.docs.thundra.io/features/test-runs) and 
[Change Impact Analysis](https://foresight.docs.thundra.io/features/analyze-code-change-impact) features.

> **_NOTE:_** ⚠️ You'll need to have a reasonably modern version of `node`. This won't work with versions older than 9, for instance.

## Prerequisites
Foresight analyzes your test and coverage report artifacts. 

### Available test framework and report pairs:

| Test framework | Report format  |
|----------------|----------------|
|TESTNG|n/a*|
|JUNIT|n/a*|
|JEST|JUNIT|
|PYTEST|JUNIT|
|XUNIT2|n/a*|
|XUNIT2|TRX|
|GOLANG|n/a*|

> **_NOTE:_** ⚠️ You don't need to fill report format fields marked as **n/a**.

### Available coverage formats:

| Coverage formats  |
|----------------|
|JACOCO/XML|
|COBERTURA/XML|
|GOLANG|

## Usage

To use the action, add the following step after your test execution step. Please fill the `test_format`, `test_framework` and `coverage_format` fields by checking the supported options above.

You can get your `api_key` after sign up to Foresight.

```yaml
- name: Analyze Test and/or Coverage Results
  uses: thundra-io/foresight-test-kit-action@v1
  if: success() || failure()
  with:
    api_key: <your_api_key_required>
    test_format: <test_format_optional>
    test_framework: <test_framework_optional>
    test_path: <test_results_path_optional>
    coverage_format: <coverage_format_optional>
    coverage_path: <coverage_results_path_optional>
```

## Configuration

| Option                | Requirement       | Description
| ---                   | ---               | ---
| `api_key`        | Required          |  Foresight Api Key.
| `github_token`        | Optional          | An alternative GitHub token, other than the default provided by GitHub Actions runner.
| `test_framework`      | Optional          | Runtime test framework name(jest, pytest, junit etc.)
| `test_format`      | Optional          | Runtime test format name(trx, junit etc.)
| `test_path`       | Optional              | Test results directory/file path.
| `coverage_format`      | Optional          | Runtime coverage format name(jacoco/xml, cobertura/xml, golang etc.)
| `coverage_path`       | Optional              | Coverage results directory/file path.
| `cli_version`       | Optional              | Installed Foresight cli version. Default is latest.
| `working_directory`       | Optional              | Specify it if you change default working directory for run.
| `disable_action`       | Optional              | Disable Foresight test kit action without removing from yml.
