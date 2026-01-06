# Creating a Specialized Agent with a task.

Interacting with the modern world means communicating effectively with AI.
Therefore, you must be very aware of the following concept, or you are lost.

**Prompt Engineering:** is the art of communicating effectively with Large Language Models (LLM). Think of it as having a virtual assistant available 24/7 on your computer, ready to execute repetitive tasks with consistency and quality.

The intention is for the AI to do some work for you. The analogy is thinking you have a real-life assistant sitting at your house, on your computer, and you ask them to write something for you, and repeat it the next day and the day after, and so on every time you need it.

This guide will teach you how to create **automated workflows** using a practical case: a taco shop that needs constant content for social media.

### **🌮 Prompt Engineering Guide: From Basic to Professional**

**Scenario:** You own a taco shop and need to increase your clientele. The solution is greater visibility on social media, but this requires **constant and quality content**.

**Advantage of AI Agents:** You don't have one, but infinite specialized assistants. Each one can adopt a personality, role, or specific expertise according to your needs.

**Your crucial job:** is to **define the task correctly**. Unfortunately, it cannot be vague and poor like *"make content for my taco shop"*.

> I emphasize “Defining the task correctly”

To achieve this, I recommend the following:

- Write in **Markdown** and have your result be **Markdown**.
- Test it with various combinations, always adding more information.
- Ask the AI to explain how to improve it or to improve it directly.
- Ask the AI to ask you questions so you can add that information.

Now let's see an example of what prompts could look like.

## ❌ Bad Prompt (Vague and Without Context)

`Write a post about tacos al pastor for Instagram.`

**Why does it fail?**

- It has no business context.
- It doesn't specify tone or audience.
- It doesn't give unique details of YOUR taco shop.
- Generic result that any taco shop could use.

---

## ✅ Professional Prompt (Specific and Contextualized)

### Your Business Context

`# CONTEXT
You are the content creator for "Tacos El Trompo Dorado", 
a family-run taco shop in Mexico City specializing in 
authentic tacos al pastor for 25 years.

# YOUR MISSION
Create an educational and inspirational Instagram post 
explaining why our tacos al pastor are superior, 
focusing on the connection between traditional technique and flavor.

# UNIQUE ELEMENTS OF OUR BUSINESS
- We use pork marinated for 24 hours in a secret family adobo.
- Our vertical "trompo" is cooked with mesquite wood and charcoal.
- The master "taquero" has 30 years of experience.
- We cut the meat directly from the trompo at the time of ordering.
- The fat falling from the trompo constantly bathes the meat below, 
  creating layers of flavor.
- We use natural pineapple that caramelizes with the heat of the trompo.
- Hand-made tortillas made on the spot.

# DESIRED TONE AND STYLE
- Passionate but educational.
- Close and authentic, not pretentious.
- Use storytelling, not just facts.
- Celebrate tradition without sounding old-fashioned.

# DESIRED FORMAT
- Catchy title (maximum 8 words).
- Main post: 150-200 words.
- 3-5 relevant hashtags.
- Call-to-action at the end.

# SPECIFIC ANGLE
Focus on the science and art behind the trompo: how 
constant rotation, vertical heat, and self-marination with 
its own fat create a flavor impossible to replicate on a griddle.`

## Output Example

This is optional but very, very powerful when used well, because the language is hidden in the example.

Watch a comparison of the first 2 sentences with different language.

### Average AI

Why do tacos al pastor taste different in every taco shop?

As the trompo spins, something magical happens: the melted fat falls like rain onto the lower layers of meat.

### Colloquial Mexican (Example translated for tone)

Honestly, not all tacos al pastor are the same. And it's no joke.

The trick is in the trompo; as it rotates, the little grease falls and that stuff makes the bottom layers juicier.

### "Polanco" Influencer (Example translated for tone)

Ok, I have to confess something, I used to only go to "nice" taco shops, you know, with artisanal mezcal... but a friend showed me this and it changed my life.

The meat spins on that giant trompo that looks incredible in stories "by the way," and while that happens the juices go falling and marinating everything OMG that's why it's so deli!

Now a final example, let's say more neutral, without sounding like AI in how it should respond.

```jsx
# DESIRED FORMAT EXAMPLE

---
**TITLE:** [Maximum 8 words, must catch attention]

**POST BODY:**
[Paragraph 1: Emotional hook or surprising fact - 2-3 lines]

[Paragraph 2: Storytelling or technical explanation - 3-4 lines]

[Paragraph 3: Connection with the customer and closing - 2-3 lines]

**HASHTAGS:** #hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5

**CALL-TO-ACTION:** [Phrase inviting a specific action]
```

**TITLE:** The Tacos That Have Me Hooked

**POST BODY:**

I don't know about you, but I've already tried a ton of taco shops and I always come back here. Why? Because these tacos actually taste like they should.

The trick is in how they do things. The meat marinates for a whole day before it reaches the trompo, with an adobo they've been making the same way for 25 years. While it spins, the fat drips and bathes all the meat below—that's where the amazing flavor is. They put pineapple on top that burns slowly and releases a really nice sweet touch. And they use mesquite wood, so everything has that smoky flavor you don't find just anywhere.

Don Raúl, the master taquero, knows exactly which part to cut depending on what you order. He's been doing this for 30 years. He cuts the taco for you on the spot, puts it in a freshly made tortilla, and that's it. That's how you really enjoy eating.

**HASHTAGS:**
#TacosAlPastor #MexicoCity #Tacos #MexicanFood #TacoTime

**CALL-TO-ACTION:**
If you're in the area, stop by. It's totally worth it. Come hungry because you'll want a second order. 🌮

### Ready, once you've learned how to create a good prompt, now let's create a task and an agent.

## Creating the Agent

When you have a task, any agent can perform it, but for this case, we will create a passionate and knowledgeable agent on the subject, with a controversial touch (an effective strategy on today's social media).

Visual Image.

For the fictional case and because in Control Markets agents can be whatever they want.

Our employee will be a modern raccoon passionate about tacos. It's important to give him a photo, which you can also generate with AI.

Visual identity helps you to:

- Distinguish between multiple agents.
- Associate personalities with specific tasks.
- Identify which agent performs each job best.

![racoon tacos.png](attachment:1696e0d4-21cf-42b3-b689-c78092717463:racoon_tacos.png)

### Create New Agent

![image.png](attachment:be4479ad-73ed-4fa6-a2c5-b88100ae6845:image.png)

Inside the app, create a new agent.

This will take us to an interface, somewhat complicated for now because there are many options to select, but don't worry, we only need to configure a few sections.

Crop the image, preferably with your character's face in the center.

![image.png](attachment:009de8b2-e9fe-4a1e-b00b-3edd2b777da6:image.png)

1. Give a name to the agent card “The Taco Raccoon”
2. Set the language, it's English by default.
3. Give a name to your Agent character “Raconsito”
4. Load an image and crop it to his face.

Once configured, you can save it.

### Ready, now let's create the task.

Click on tasks and create a new one.

![image.png](attachment:b77d117c-1004-4826-8e17-512abc3d6a2f:image.png)

Tasks, like everything else, are recognized by their image, so with a different taco, you can start recognizing your variations.

- Instagram Post.
- Youtube Script.
- Marketing.

Etc.

Then simply add the prompt.

### Workflow Creation

Go to the workflow section.

![image.png](attachment:5a77550b-68a8-4414-88e3-cc3046692c86:image.png)

In Agents, we are going to add the agent. Use the search by name to make it easier.

In Task, we are going to add the task you created.

And it's simply a matter of connecting them.

Then execute with the blue button or the entire flow.

![image.png](attachment:597e8911-9be9-4190-8998-bc740e1daac5:image.png)

The task has several levels of intelligence: fast, balanced, and intelligent.

Each one consumes more time and computing power, but theoretically returns a better result.

I always recommend using fast or balanced.

### Conclusions.
