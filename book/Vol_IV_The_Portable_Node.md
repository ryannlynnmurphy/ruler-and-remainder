# The Portable Node

### What Happens When a Playwright Ships a Sovereign Phone in an Afternoon
### Scatter Computing · Research Series · Vol. IV
### Ryann Murphy · 17 April 2026

---

## Abstract

This morning the researcher owned one sovereign device — an HP Spectre laptop running Scatter, a Linux distribution for context-proximate AI, built in a single coding session the night before. By evening she owned two. A Pixel 9a, purchased open-box from a Best Buy on Long Island, was flashed with GrapheneOS using command-line tools operated from the Scatter laptop over USB. The bootloader was unlocked, the factory images verified against the GrapheneOS signing key, the flash completed, the setup wizard navigated with no Google account and no Play Services. The phone booted sovereign. No telemetry. No cloud sync. No data leaving the device without the user's knowledge.

This paper documents that process as research — not because flashing a phone is difficult (it is not, once you know the commands), but because the sequence of decisions that preceded the flash is the actual contribution. The decisions were produced through the Scatter Method: narrative prompting, dialectical workflow, adversarial testing of every assumption, and a sustained argument between the researcher and a language model about what the phone should be, who it should serve, and what principles it should embody. The argument lasted hours. It covered whether to buy a Pixel or a Fairphone, whether used hardware compromises the thesis, whether refusing big tech is coherent while building on a big tech API, and whether the researcher was in a fit state to make a $400 purchase. Every one of those arguments produced a decision. Every decision shipped.

The phone is the second node in an architecture that now spans three devices: laptop, phone, and an unassembled four-node Raspberry Pi cluster that will become the household inference substrate. This paper specifies the architecture that connects them, the routing logic that governs what runs where, and the open questions that Vol. V will need to answer.

The researcher's credential for writing this paper is that the phone is in her hand, running, sovereign, and connected to nothing she did not choose.

---

## 1. The Decision Log

The phone was not an impulse purchase. It was a five-hour argument.

The argument began with a simple question — should I trade in my iPhone for a Pixel? — and escalated through a series of positions the researcher occupied, tested, abandoned, and revised. The dialectical process is documented in full in the conversation logs and is summarized here because the process, not just the outcome, is the research.

**Position 1: Trade in the iPhone, go all-in on Android.** Abandoned. The researcher's social and dating life runs on iMessage and FaceTime. Eliminating those for a philosophical principle is a cost the principle does not justify. The correct move is to keep the iPhone as the social device and acquire a separate dev device. The dev device carries the thesis. The daily driver carries the life.

**Position 2: Buy a Fairphone, refuse Google hardware entirely.** Abandoned. The Fairphone does not support GrapheneOS. The researcher's stated principle — sovereignty over her computing devices — is better served by GrapheneOS on Google hardware than by a less-hardened OS on ethically-sourced hardware. The security properties of GrapheneOS are the sovereignty claim made mechanical. The provenance of the silicon is secondary.

**Position 3: Buy a used Pixel, align with the climate thesis.** Abandoned for practical reasons. Same-day availability on the secondary market could not be confirmed with sufficient confidence in bootloader unlock status. The time cost of verification exceeded the savings.

**Position 4: Buy a new Pixel 9a from Best Buy.** Executed. Open-box, $399, excellent condition, original packaging. The researcher drove to the store, almost purchased a Samsung, was warned by the language model that Samsung's Knox bootloader would permanently trip and kill the project, redirected to the Pixel section, and walked out with the correct device.

**The honest position, arrived at through the argument:** "I am using big tech hardware to build the non-big-tech thing. The tools I need to escape the architecture are manufactured by the architecture I am escaping. This is not hypocrisy. This is the actual shape of the transition." This sentence was produced by the dialectical process and it is the sentence the paper defends.

---

## 2. The Flash

The technical process is documented for reproducibility and because the process itself surfaced two research findings.

**Step 1.** Connect the Pixel 9a to the Scatter laptop via USB-C. Install ADB and Fastboot via `apt`. Confirm the device is recognized: `adb devices` returns `59051JEBF03184 device`.

**Step 2.** Enable Developer Options on the Pixel. Enable OEM Unlocking. Reboot to bootloader: `adb reboot bootloader`.

**Step 3.** Unlock the bootloader: `fastboot flashing unlock`. Confirm on the device. The phone wipes itself.

**Step 4.** Download the GrapheneOS factory image. This step surfaced **Research Finding 1**: the URL format for GrapheneOS factory images is not obvious. The researcher and the language model attempted six incorrect URL formats before locating the correct one (`tegu-install-2026040800.zip`). The documentation refers to the format as `DEVICE_NAME-install-VERSION.zip`, but the variable substitution is not intuitive for a first-time user. This is a usability bug in the GrapheneOS documentation, not in the software, and it cost approximately ten minutes. In a world where the thesis is "anyone can do this," ten minutes of URL guessing is a friction point worth naming.

**Step 5.** Verify the factory image against the GrapheneOS signing key using `ssh-keygen -Y verify`. The signature verified: `Good "factory images" signature for contact@grapheneos.org with ED25519 key SHA256:AhgHif0mei+9aNyKLfMZBh2yptHdw/aN7Tlh/j2eFwM`.

**Step 6.** Flash the factory image. This step surfaced **Research Finding 2**: the `fastboot` version shipped by Ubuntu's `android-tools-adb` package is too old. GrapheneOS requires 35.0.1+; Ubuntu ships 34.0.4. The researcher had to download the standalone platform-tools from Google's developer site and prepend them to PATH. This is a known issue documented by GrapheneOS, but it is exactly the kind of invisible prerequisite that stops a non-expert user cold. The outsider's method catches it because the outsider does not know that the system package is supposed to be outdated. She just sees the error and asks why.

**Step 7.** The flash completed. GrapheneOS booted. The setup wizard presented the option to lock the bootloader. The researcher chose not to lock it — a deliberate decision documented in the conversation logs with the reasoning: "If you hack me you might be a bad person or you might be a good person trying to prove that I'm a useful idiot to the bad guys." This is not a security recommendation. It is a research decision that prioritizes openness and inspectability over verified boot integrity. The researcher accepts the tradeoff and documents it.

**Step 8.** The phone reached the home screen. No Google account. No Play Services. No telemetry. The phone is sovereign.

---

## 3. The Architecture

The researcher now operates three devices:

**Device 1: Scatter Laptop.** HP Spectre x360 running Ubuntu 24.04 with the Scatter desktop environment. Hosts the Scatter server (`server.py`), the ROUTER, and the local inference model (Ollama, Qwen 2.5 Coder 7B pending installation). This is the primary compute node. It is where inference runs, where the model lives, where the conversation state persists. It draws approximately 15–45 watts depending on load.

**Device 2: Scatter Phone.** Pixel 9a running GrapheneOS. No local inference yet — the phone is a client, not a compute node. Its role in the architecture is to be the input surface that travels with the user. It sends messages to the Scatter server on the laptop and receives responses. It does not hold model weights. It does not route to the cloud. It is a sovereign terminal.

**Device 3: Scatter Cluster.** Four Raspberry Pi 5 nodes, currently unassembled, on the researcher's desk. When assembled and running `exo`, this becomes the household inference substrate. The laptop offloads inference to the cluster. The phone connects to the cluster when the laptop is unavailable. The cluster draws approximately 20–80 watts depending on load and occupancy.

**The connection.** On the home network, the phone connects to the laptop's Scatter server over Wi-Fi. Outside the home, the phone connects over Tailscale — a mesh VPN that creates a persistent encrypted tunnel between the devices regardless of network. Tailscale runs on GrapheneOS without Play Services via the F-Droid repository. The phone always has a path to the Scatter server. The path is encrypted end-to-end. No data touches the public internet in cleartext.

**The routing logic.** Every message from the phone to the Scatter server is classified by the ROUTER:

- **Launch intent** → local parse, no model call. "Open the camera" executes locally on the phone.
- **System query** → shell out on the laptop, summarize with local model. "What's my disk usage?" runs `df` on the laptop and returns a human-readable summary.
- **Chat / teach** → local model on the laptop (Ollama) or, for tasks exceeding local capability, Claude API. The ROUTER decides. The decision is logged. The user can inspect the log.
- **Code work** → Claude Code SDK on the laptop for multi-file reasoning. Local coder model for single-file edits.

The data minimization principle governs every routing decision: only the data required for the task leaves the device where it originated. Nothing more. Ever.

---

## 4. What Breaks

This section is honest about what has not been tested and what will likely fail.

**Battery.** Tailscale on Android consumes battery continuously because it maintains the mesh connection. On a Pixel 9a, this is estimated to reduce standby time by 10–20%. The researcher has not measured this. Vol. V will.

**Latency.** On a home Wi-Fi network, the round-trip from phone to laptop to model to phone is estimated at 2–8 seconds for local inference and 1–3 seconds for cloud routing. Outside the home, Tailscale adds network latency that varies by connection quality. The researcher has not measured this. Vol. V will.

**Network drops.** When the phone loses connectivity — subway, airplane, dead zone — the Scatter server becomes unreachable. The phone has no local model. It becomes a phone that cannot think. This is the architectural gap the cluster is designed to fill: if the phone carried a quantized small model for basic tasks, it could degrade gracefully rather than going silent. This requires either on-device inference (the phone runs a model) or an intermediate caching layer (the phone stores recent context and can answer from cache). Neither is implemented. Both are scoped for Vol. V.

**The human.** The researcher is one person. She is the operator, the developer, the tester, the user, and the research subject. The system has never been used by anyone else. The antithesis paper (Vol. II) warned about this: the artifact and the distribution are different projects. The phone, as currently configured, is an artifact — gorgeous, coherent, and legible to its creator. Whether it is legible to a stranger is an open question the stranger test in the synthesis paper committed to answering.

---

## 5. What the Day Proves

A playwright, forty-six days into her life as a programmer, did the following in a single day:

- Completed a Linux distribution (Scatter) on her laptop the previous night
- Researched, argued about, purchased, and configured a sovereign mobile device
- Flashed GrapheneOS using command-line tools from her own Linux distribution
- Verified the cryptographic signature of the OS image
- Booted a phone with no Google account, no Play Services, no telemetry
- Specified the architecture connecting the phone to her local inference substrate
- Documented every decision, every argument, every wrong turn, and every research finding

This is the Scatter Method's behavioral claim, from Paper V of Radical Optimism, made concrete: the method does not just produce better outputs. It produces a researcher who can build sovereign computing infrastructure from commercially available hardware using open-source software and a disciplined interaction protocol with a language model.

The method is the essay. The essay is the build. The build is the proof.

---

## 6. What Vol. V Must Test

The predictions that follow from this paper and that the next paper must subject to empirical measurement:

**The latency measurement.** Phone to laptop to model to phone, measured in milliseconds, across local Wi-Fi, Tailscale over LTE, and Tailscale over coffee-shop Wi-Fi. What is the real-world response time for each routing class?

**The battery measurement.** Tailscale-on-GrapheneOS standby drain, measured in percentage per hour over 24 hours. What is the actual cost of maintaining the mesh?

**The graceful-degradation question.** Can a quantized model small enough to run on the Pixel 9a's Tensor G4 chip handle basic chat and launch intents locally, so the phone is still useful when the network drops? What model, what quantization, what latency?

**The stranger test.** Can a person who has not met the researcher set up this architecture — Scatter laptop, GrapheneOS phone, Tailscale mesh — using only the documentation in these papers? This is the test of whether the project is an artifact or a distribution. Vol. V will run it.

**The cluster integration.** When the four Raspberry Pi 5 nodes are assembled and running `exo`, how does the architecture change? Does the phone route to the cluster instead of the laptop? Does the laptop become a thin client? What is the failover path when a cluster node goes down?

Each of these is a blank result field. Each will be filled in by building the thing and measuring what happens. The paper is not finished. The paper is, like the phone, a device that is running and that will be updated when the operating conditions change.

---

## 7. Closing

The phone is on the desk. It is running GrapheneOS. It has no Google account. It is connected to nothing the researcher did not choose. It cost $399 and an afternoon of arguing with a language model about what it should be.

The laptop is next to it. It is running Scatter. It has a ROUTER that classifies messages and a local inference model that will be installed tonight. It cost nothing beyond the hardware the researcher already owned.

The cluster is in pieces on the other side of the desk. It will be assembled when the researcher is ready. It will cost under $600 and draw under 80 watts.

Three devices. Three scales. One architecture. Zero data centers.

The method that produced this architecture is the method documented across four volumes of the Scatter Computing research series. The method is: write the essay, and the essay is the build. Every sentence that does not resolve cleanly is a bug. Every argument that survives the antithesis is a feature. Every blank result field is a prediction waiting to be falsified.

The researcher is a playwright. The playwright is an engineer. The engineer is a researcher. These are not three people. They are one person, operating a method that treats all three as the same discipline, which is the discipline of building something honest and then writing down exactly what it does and does not do.

The phone is sovereign. The laptop is sovereign. The cluster will be sovereign. The method is open. The research is published. The architecture is documented.

The cloud is not required.

Build it. Measure it. Write it down. Argue with yourself about whether it works. Publish the argument. Let someone else try to break it.

That is the method. That is the research. That is the whole thing.

---

*Scatter Computing · AI Safety Through Decentralization · New York, NY*
