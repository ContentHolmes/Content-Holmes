The urlblock module consists of data-structures and algorithms that help Content Holmes analyze and filter out websites that contain profane content from those that are safe to visit. This tutorial details the construction of the relevant data-structures and algorithms and the intuition behind their implementation.

The requirements for this module is to be quick in analyzing, tagging and determining whether a website is safe to open. This should be done to streamline browsing experience, and only permit negligible delays. To achieve this speed URL storage data-strcurures, *[bannedmanager](./module-urlblock_bannedmanager.html)* and *[trustedmanager](./module-urlblock_trustedmanager.html)* were created to give fast-lookup time even with high amount of storage. It also works in the background to tag website types and user searches on search engines. This is done to keep users from accidently stumbling onto profane content and to block such content providers faster the next time round.

### URL Storage Data-structures
![Storage structure](./img/findurlalgorithm.png)

The URL Storage datastructures provide two basic functionalities,
 - Store a new URL
 - Find whether a URL exists in storage

Both of these methods are asynchronous so that the extension core does not need to stop for these functions to return and thus continue calling on other functionalities in the time being. This gives a significant time boost in comparison to calling on all the modules in a serial fashion. 

The URL store consists of the following datastructures and steps:
1. **Array:** An array of most frequently visited websites. This array is hard-coded (in [data/URLBlocker](./module-data_URLBlocker.html)) and hence of a constant size. This was done so that these websites are blocked the fastest. It is important to note here that addition of a new website does not concern this array as the new websites will not be as frequent. Since this array is hard-coded, it is not user specific and same for all the users. 
**Time Complexity:** *Search:* **O(1)** *Add:* **-**.
2. **LFU-Cache:** A least frequently used cache is used to store user specific websites that have been visited the most frequently. If the website has not been found in the array above, this is the next data-structure to be searched. It stores the about 1000 most recently and frequently visited websites on the top with an aging factor. It provides a constant time lookup and addition, however, may give false negative because of older entries getting kicked out of it. This is the only structure in which add function adds a new element. 
**Time Complexity:** *Search:* **O(1)** *Add:* **O(1)**.
3. **Hash-table:** A hashtable provides constant time lookup in the average case and O(logn) in the worst case. This datastructure is the one that is searched if he LFU-Cache gives a false-negative. The hashtable acts as a basket to catch all the entries that are leaked from the LFU-Cache. In the average case, this stage will never be reached in the system, since LFU-Cache keeps discarding less used old entries. 
**Time Complexity:** *Search:* **O(1)** *Add:* **-**.
4. **Cloud-table:** A final call to the server is made to check if the website is present in the global database. Since this might entail extra time due to communication, this call is made in parallel to the call to the LFU-Cache (Contrary to the figure above). If this ends first and the website is found to be either clean or profane, the procedure is terminated and necessary action is taken. 
**Time Complexity:** *Search:* **O(1) + Communication** *Add:* **-**.

So, the net time taken to find whether a website is present in the system is **O(1)** and to add a website to the store is also, **O(1)**. 

**Quick Note:** All the datastructures individually give false negatives i.e. a website might be in the store, but the search operation may still return *element not found.*

### Search Analyzer
