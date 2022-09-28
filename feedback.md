# Feedback

Overall, amazing work this week. I know you're a little disappointed in having to restart after Tuesday but I think the effort was herculean and really paid off. Here are some general notes:

- remember to keep your routes RESTful -- I think some of your routes would fit more naturally in the other controllers -- I've noted in the files where I saw that
- watch your file capitalization - your model files should be capitalized, ``cardService` should be `CardService`
- in your DeckService you have a lot of your model methods just wrapped -- unless the service is doing something _else_ you can just call the Model methods directly
