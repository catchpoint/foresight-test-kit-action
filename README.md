# Foresight Test Kit Action

A GitHub Action to analyze test and/or coverage results.

## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run all
```

Run the tests :heavy_check_mark:  
```bash
$ npm test
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)


## Configuration

| Option                | Requirement       | Description
| ---                   | ---               | ---
| `github_token`        | Optional          | An alternative GitHub token, other than the default provided by GitHub Actions runner.
| `test_framework`      | Optional          | Runtime test framework name(jest, pytest, junit etc.)
| `test_format`      | Optional          | Runtime test format name(trx, junit etc.)
| `test_path`       | Optional              | Test results directory/file path.
| `coverage_format`      | Optional          | Runtime coverage format name(jacoco/xml, cobertura/xml, golang etc.)
| `coverage_path`       | Optional              | Coverage results directory/file path.
| `cli_version`       | Optional              | Installed Foresight cli version. Default is latest.
| `disable_action`       | Optional              | Disable Foresight test kit action without removing from yml.

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  api_key: <your_api_key>
  test_format: <test_format>
  test_format: <test_framework>
  test_path: <test_results_path>
  coverage_format: <coverage_format>
  coverage_path: <coverage_results_path>
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action!

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action

To use the action, add the following step before the steps you want to track.

```yaml
- name: Analyze Test and/or Coverage Results
  uses: runforesight/foresight-test-kit-action@v1
  with:
    api_key: <your_api_key_required>
    test_format: <test_format_optional>
    test_framework: <test_framework_optional>
    test_path: <test_results_path_optional>
    coverage_format: <coverage_format_optional>
    coverage_path: <coverage_results_path_optional>
```