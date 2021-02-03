# asciicamera
<em>A Real-Time ASCII converter camera app</em>

After watching this YouTube video: https://www.youtube.com/watch?v=LrEvoKI07Ww&t=110s by @muzkaw featuring a C++ .jpg to ASCII converter that he made, and it got me thinking about whether anyone had made one to run in real time on a web app. 

A quick Google search yielded one result: https://andrei.codes/ascii-camera/ by @idevelop. His runs excellently, and I did have a few performance-related issues to get through during the making of mine, but how well his ran motivated me that it was possible to achieve. 

I used the WebRTC @webrtc web API for the video capture, sending the raw video stream and the grayscaled, contrast-adjusted and mirrored version to two hidden canvases. After setting a resolution (weighted differently for width vs height as ASCII characters are taller than they are wide), I obtained the average brightness values for each group of pixels and mapped them to an ASCII character according to this source: http://www.cs.umd.edu/Outreach/hsContest98/questions/node4.html except I subbed their 'darkest' character, '$', for Andrei's choice of '@' as I just thought it looked better.

Note that this app doesn't support mobile or Safari at this time.
