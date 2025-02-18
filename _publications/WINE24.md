---
title: "A Computer-aided Approach for Approximate Nash Equilibria"
collection: publications
category: manuscripts
permalink: /publication/WINE24
excerpt: ''
date: 2024-12-01
venue: 'WINE'
paperurl: 'https://billyldc.github.io/files/WINE24_A_Computer-aided_Approach_for_Approximate_Nash_Equilibria.pdf'
# citation: 'Your Name, You. (2009). &quot;Paper Title Number 1.&quot; <i>Journal 1</i>. 1(1).'
---

author: Dongchen Li, Hanyu Li, Xiaotie Deng

Abstract: Since the landmark PPAD-completeness result for Nash equilibria in two-player normal-form games, significant research has focused on developing polynomial-time algorithms to compute $\epsilon$-approximate Nash equilibria ($\epsilon$-NE). The challenge of establishing the optimal approximation guarantee in polynomial time remains pivotal. While advancements have been made for two-player games, progress in multi-player games has been limited. The current best algorithm for three-player games achieves a $(0.6+\delta)$-NE by extending the two-player algorithm. Difficulties arise due to the increased sophistication of multi-player games and the lack of tools for analyzing approximation bounds. This paper introduces a computer-aided method for approximation analysis using a domain-specific language called LegoNE. Based on LegoNE, we are able to turn high-level intuitions into an algorithm. Then, LegoNE can automatically discover lower-level properties and prove an approximation bound. Using LegoNE, we design a new algorithm for three-player games that achieves a $(0.56+\delta)$-NE, improving the previous best bound. This shows that combining human intelligence with computer-aided methods allows us to obtain higher-level understandings and better results.