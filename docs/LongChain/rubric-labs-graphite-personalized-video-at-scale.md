---
title: "How Rubric Labs and Graphite leveraged LLMs to create personalized videos at scale"
site: "LangChain Blog"
published: 2023-12-19T18:27:38.000Z
source: "https://blog.langchain.com/rubric-labs-graphite-personalized-video-at-scale/"
domain: "blog.langchain.com"
language: "en"
word_count: 1603
---

# How Rubric Labs and Graphite leveraged LLMs to create personalized videos at scale

As 2023 comes to a close, [Graphite](https://graphite.dev/?ref=blog.langchain.com) wanted to celebrate [GitHub](https://github.com/?ref=blog.langchain.com) users for their contributions throughout the year. The goal was to end the year with a gift for developers to reminisce, reflect, and feel inspired for the new year.

As the creators of [GitHub Wrapped](https://github.com/neat-run/wrapped?ref=blog.langchain.com), a project we built in 2021 and scaled to 10k users, our team at [Rubric](https://rubriclabs.com/?ref=blog.langchain.com) was perfectly positioned to take this on.

However, 2023 was unlike any other year. 2023 was the year [LLMs](https://en.wikipedia.org/wiki/Large_language_model?ref=blog.langchain.com) became generally available.

Compared to 2021, it felt like the realm of opportunities had opened wide for us and we wanted to push past static images and templated storylines as we had done previously. Instead, we wanted to create something truly personalized, completely unique to the end user. We also wanted this to be immersive. And so, [Year in code](https://year-in-code.com/?ref=blog.langchain.com) was born — personalized, AI-generated video!

It’s no surprise that we ended up leveraging [LangChain](https://langchain.com/?ref=blog.langchain.com) to build this. LangChain’s out of the box helper functions helped us get to production in days, rather than weeks.

## Important Links

- [Try Year in code](https://year-in-code.com/?ref=blog.langchain.com)
- [GitHub repository](https://github.com/withgraphite/year-in-code?ref=blog.langchain.com)
- [Try Graphite](https://graphite.dev/?ref=blog.langchain.com)

## Tech Stack

- [GitHub GraphQL](https://docs.github.com/en/graphql?ref=blog.langchain.com) API to fetch GitHub stats
- [LangChain.js](https://js.langchain.com/?ref=blog.langchain.com) & [OpenAI GPT-4-turbo](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo?ref=blog.langchain.com) to generate the `video_manifest` (the script)
- [Remotion](https://www.remotion.dev/?ref=blog.langchain.com) to create and play the video
- [AWS Lambda](https://aws.amazon.com/lambda/?ref=blog.langchain.com) to render video
- [AWS S3](https://aws.amazon.com/s3/?ref=blog.langchain.com) to store video
- [Three.js](https://threejs.org/?ref=blog.langchain.com) for 3D objects
- [Supabase](https://supabase.com/?ref=blog.langchain.com) for database and authentication
- [Next.js](https://nextjs.org/?ref=blog.langchain.com) 13 for frontend
- [Vercel](https://vercel.com/?ref=blog.langchain.com) for hosting
- [Tailwind](https://tailwindcss.com/?ref=blog.langchain.com) for styling
- [Zod](https://zod.dev/?ref=blog.langchain.com) for schema validation

## Architecture

## Overview

Let’s summarize the architecture in a diagram:

![](https://blog.langchain.com/content/images/2023/12/rubric-architecture.png)

Overview of the architecture

We begin by authenticating a GitHub user using [Supabase auth](https://supabase.com/docs/guides/auth/social-login/auth-github?ref=blog.langchain.com). Once authenticated, we fetch user-specific data from the GitHub GraphQL API, and store it in our PostgreSQL database hosted on [Supabase](https://supabase.com/?ref=blog.langchain.com). Supabase offers an out of the box API with [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security?ref=blog.langchain.com) which streamlines reads/writes to the database.

At this point, we pass user stats to the LLM (`gpt-4-turbo`) using LangChain. Leveraging prompt engineering, [function-calling](https://js.langchain.com/docs/modules/model_io/models/chat/how_to/function_calling?ref=blog.langchain.com) & [Zod schema validation](https://js.langchain.com/docs/modules/model_io/output_parsers/structured?ref=blog.langchain.com), we are able to generate structured output called the `video_manifest`. Think of this as the script of the video.

This manifest is passed to a [Remotion player](https://www.remotion.dev/docs/player/?ref=blog.langchain.com) which allows easy embeds of Remotion videos in React apps at runtime. The manifest maps over a set of a React components.

At this point, the user is able to play the video in the client and also share their URL with their friends. Next.js 13 [server rendering patterns](https://nextjs.org/docs/app/building-your-application/rendering?ref=blog.langchain.com) make this seamless for the end user. Additionally, the user is able to download an `.mp4` file for easy sharing by rendering the video in the cloud using [AWS lambda](https://www.remotion.dev/docs/lambda?ref=blog.langchain.com) and storing the video in an S3 storage bucket.

Let’s explore this in greater detail.

### Fetching stats

When you log into the app with GitHub, we fetch some of your stats right away. These include:

- your most-written languages
- repositories you’ve contributed to
- stars you’ve given and received, and
- your newest friends.

We also fetch your total commits, pull requests, and opened issues. Check the type below to get a sense of the data we fetch. We wanted to be cognizant of [scope](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps?ref=blog.langchain.com#available-scopes) here so we ask for the most necessary permissions, excluding any access to code. The project is also fully open source to reinforce trust with the end user.

```javascript
interface Stats {
    username: string
    year: number
    email: string
    fullName: string
    avatarUrl: string
    company: string
    commits: number
    pulls: number
    contributions: number
    contributionsHistory: Week[]
    repos: number
    reviews: number
    stars: Star
    topRepos: Repo[]
    topLanguages: Language[]
    topFollows: Follows
    firstContributionDate: string
    codingStreakInDays: number
}
```

[Check the full type here](https://github.com/withgraphite/year-in-code/blob/19397d1dbc9011907604822d263bfc35c73d64ef/lib/types/github.ts?ref=blog.langchain.com#L1)

## Generating the manifest

We then pass these stats to OpenAI’s `gpt-4-turbo` model via LangChain, along with a prompt on how to format its response. Here’s the prompt:

```js
const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    \`You are Github Video Maker, an AI tool that is responsible for generating 
a compelling narative video based on a users year in code. 
It is very important that this video feels personal, motivated by their 
real activities and highlights what was special about that users year in code. 
The goal of this video is to make the end user feel seen, valued and have a 
nostalgic moment of review. You do not need to touch on everything, rather 
hone in on and focus on the key elements that made this year special.
Make sure there is a story arch that builds over time, and that the video 
has a clear beginning, middle and end. When choosing colors, make sure to hone in 
on a definitive and aesthetically pleasing color palette, chosing complimentary 
colors that aren't aggressively different.'
Videos must always have exactly 12 scenes.
Today's date (UTC) is ${new Date().toLocaleDateString()}.\`
  ],
  ['human', \`The GitHub stats are as follows: ${stats}\`]
]);
```

[Full link to prompt here](https://github.com/withgraphite/year-in-code/blob/19397d1dbc9011907604822d263bfc35c73d64ef/lib/utils/generate.ts?ref=blog.langchain.com#L40)

Given user stats, the AI generates a `video_manifest` which is similar to a script for the video. The manifest tells a unique story in 12 sequences (as defined in the prompt). Assuming each sequence lasts 5 seconds, this results in a 60 second video consistently.

Here we ran into a challenging problem: do we give the AI complete creative freedom or do we template as guardrails for the AI?

After running some experiments, we quickly realized that in the given timeframe, we couldn’t generate high quality video by giving AI the complete creative freedom. While the output was decent and could have been improved, it wasn’t good enough to have that nostalgic moment, especially in the engineering time that we had.

So instead we struck middle ground by creating a bank of “scenes” and parametrized them as much as possible. This allowed the AI pick the most relevant scenes based on the user’s data based on descriptions for each scene that the AI could match with. Using these AI-selected scenes, and passing user-specific data, we are able to generate a unique sequence of personalized frames.

This was possible using [OpenAI’s Function Calling](https://platform.openai.com/docs/assistants/tools/function-calling?ref=blog.langchain.com) which enabled the AI to output parsable text, conforming to a [Zod schema](https://www.npmjs.com/package/zod-to-json-schema?ref=blog.langchain.com). The schema uses a Zod discriminated union (not the name of a rockband) to distinguish scenes:

```javascript
import z from 'zod'

export const videoSchema = z.object({
  scenes: z
    .array(
      z.object({
        text: z.string().describe('Displays on screen'),
        animation: z
          .discriminatedUnion('type', [
            z
              .object({
                type: z.enum(['intro']),
                planet: z
                  .enum([
                    'mars',
                    // ...
                    'venus',
                    'moon'
                  ])
                    .describe('Pick a random planet!')
                  })
                  .describe(
                    'Text in front of a planet'
                  )
                  // ...
                ])
              .describe('Animation to be used to display alongside the text')
            })
          )
        .describe('Scenes in the video')
})

export type Manifest = z.infer<typeof videoSchema>
```

[Check the full schema here](https://github.com/withgraphite/year-in-code/blob/main/lib/types/video.ts?ref=blog.langchain.com)

Let’s look at a sample output video manifest.

```json
[
  {
    "text": "Sarim Malik's Year in Code",
    "animation": {
      "type": "intro",
      "planet": "mars"
    }
  },
  {
    "text": "A journey through time and code...",
    "animation": {
      "type": "flashback",
      "dateTo": "2023-01-25T00:00:00Z",
      "dateFrom": "2023-12-19T00:00:00Z"
    }
  },
  ...
]
```

Sample video manifest

Each entry (scene) in the manifest is an object that has a text field and an animation field. The text is unique for each scene and so is the order of the scenes, whereas, the animation for each scene is picked form a bank of pre-built components.

## Playing the video

Now the fun part: playing the actual video. This part was challenging, because we’re quite literally letting an AI direct a video we’ll trim together. From that director’s cut, we map scenes to React components, which [Remotion](https://www.remotion.dev/?ref=blog.langchain.com) takes to generate a video. Take a look:

```javascript
export const Video = ({video}) => {
  const {fps} = useVideoConfig()

  return video.scenes.map(({text, animation}, i) => {
    switch (animation?.type) {
      case 'languages':
        return (
          <Languages from={i * fps * 5} languages={animation.languages} />
        )
      case 'people':
        return (
          <People from={i * fps * 5} people={animation.people} />
        )
      // ...
      default:
        return (
            <Conclusion from={i * fps * 5} text={text} />
        )
    }
  })
}
```

Playing the video in the client

Here, the `from` prop determines the first frame when this scene will appear.

To generate 3D objects, we leveraged [Three.js](https://threejs.org/?ref=blog.langchain.com). For example, to mould this wormhole effect from a flat galaxy image, we pushed Three’s [TubeGeometry](https://threejs.org/docs/?ref=blog.langchain.com#api/en/geometries/TubeGeometry) to its limits with high polygon count and low radius.

![](https://blog.langchain.com/content/images/2023/12/rubric-video.png)

Wormhole effect

Now, we want this experience to scale by being as lightweight as possible. By saving the `video_manifest`, instead of the actual video, we trim the bulk of the project’s bandwidth and storage by 100x. Another benefit of this approach is that the video is actually interactive.

## Rendering the video

Since we map over a manifest in the client using React components, to download the video as `.mp4`, we have to render the video first. This is achieved using [Remotion lambda](https://www.remotion.dev/docs/lambda?ref=blog.langchain.com) leveraging 10,000 concurrent AWS Lambda instances and storing the file in an S3 bucket. Each user only has to render their video once, after which we store their download URL in Supabase for subsequent downloads.

This step is the most expensive in the entire process and we intentionally added some friction to this step so that only the users that care the most about sharing their video end up executing this step.

## Conclusion

This project makes use of all the latest tech: server-side rendering, an open-source database, LLMs, 3D, generative video. These sound like buzzwords but each is used very intentionally in this project. We hope it inspires you to build something new in 2024!

Ready for takeoff? Give [Year in code](https://year-in-code.com/?ref=blog.langchain.com) a try. Translate your keystrokes into stardust. Find solace in your retrospection, let others join you in your journey, and connect with starfarers alike.

Your chronicle awaits.

---

Thanks for reading! If you have feedback on this post, please reach out to us at [*hello@rubriclabs.com*](mailto:hello@rubriclabs.com)*.*
